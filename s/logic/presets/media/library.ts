
import {sub} from "@e280/stz"
import {Kv, StorageMagazine} from "@e280/kv"

import {MediaGroup} from "./group.js"
import {Cellar} from "../../../cellar/cellar.js"
import {MediaFormat, MediaProgress, MediaSchema} from "./schema.js"
import {CodexItem} from "../../aspects/codex/parts/codex-item.js"

export type MediaRecord = {
	hash: string
	label: string
	format: MediaFormat
	mime: string
	size: number
	createdAt: number
	updatedAt: number
}

export class MediaLibrary extends MediaGroup {
	static async open(scope = "default") {
		const group = new this()
		group.cellar = await Cellar.opfs("media")
		group.#index = mediaIndex(scope)
		await group.#load()
		return group
	}

	#objectUrls = new Map<string, string>()
	#index: Kv<MediaRecord>

	progress = sub<[MediaProgress]>()
	cellar = new Cellar()

	constructor() {
		super()
		this.#index = mediaIndex("default")
		this.on.upload.sub(({files, target}) => {
			return this.#upload(files, target)
		})
		this.on.delete.sub(({items}) => {
			const hashes = this.#hashes(items)
			return this.#delete(hashes)
		})
	}

	async *records() {
		for await (const [, record] of this.#index.entries())
			yield record
	}

	async #load() {
		for await (const record of this.records()) {
			if (record.format === "image" && !this.#objectUrls.has(record.hash))
				await this.#loadPreview(record)
			this.#attachRecord(record, this.config.root)
		}
	}

	async #upload(files: File[], parent: CodexItem<MediaSchema>) {
		await Promise.all(files.map(file => this.#storeFile(file, parent)))
	}

	async #storeFile(file: File, parent: CodexItem<MediaSchema>) {
		const item = this.#attachPending(file, parent)

		try {
			const hash = await this.cellar.write(trackProgress(file.stream(), loaded =>
				this.progress.pub({item, loaded, total: file.size})
			))
			const record = await this.#saveRecord(file, hash)
			item.destroy()
			this.#attachRecord(record, parent)
			return record
		}
		catch (error) {
			item.destroy()
			this.on.refresh.pub({})
			throw error
		}
	}

	#attachPending(file: File, parent: CodexItem<MediaSchema>) {
		const item = this.config.codex.create("file", {
			label: file.name,
			format: mediaFormat(file.type),
			mime: file.type,
			size: file.size,
			previewUrl: null,
		})
		parent.attach(item)
		this.on.refresh.pub({})
		return item
	}

	async #saveRecord(file: File, hash: string) {
		const existing = await this.#index.get(hash)
		const now = Date.now()
		const record: MediaRecord = {
			hash,
			label: existing?.label ?? file.name,
			format: mediaFormat(file.type),
			mime: file.type,
			size: file.size,
			createdAt: existing?.createdAt ?? now,
			updatedAt: now,
		}
		await this.#index.set(hash, record)
		if (record.format === "image")
			this.#setPreview(hash, URL.createObjectURL(file))
		return record
	}

	#hashes(items: CodexItem<MediaSchema>[]) {
		return items
			.map(item => item.isKind("file") ? item.specimen.hash : undefined)
			.filter((hash): hash is string => !!hash)
	}

	async #delete(hashes: string[]) {
		for (const hash of hashes) {
			await this.#index.delete(hash)
			await this.cellar.delete(hash)
			this.#revokePreview(hash)
		}
	}

	findByHash(hash: string) {
		for (const [item] of this.config.root.crawl()) {
			if (item.isKind("file") && item.specimen.hash === hash)
				return item
		}
	}

	dispose() {
		for (const url of this.#objectUrls.values())
			URL.revokeObjectURL(url)
		this.#objectUrls.clear()
	}

	#attachRecord(record: MediaRecord, parent = this.config.root) {
		const existing = this.findByHash(record.hash)
		if (existing)
			return existing

		const item = this.config.codex.create("file", {
			hash: record.hash,
			label: record.label,
			format: record.format,
			mime: record.mime,
			size: record.size,
			previewUrl: this.#objectUrls.get(record.hash) ?? null,
		})
		parent.attach(item)
		return item
	}

	async #loadPreview(record: MediaRecord) {
		const cask = await this.cellar.load(record.hash)
		const blob = new Blob([cask.file], {type: record.mime || "image/*"})
		return this.#setPreview(record.hash, URL.createObjectURL(blob))
	}

	#setPreview(hash: string, url: string) {
		this.#revokePreview(hash)
		this.#objectUrls.set(hash, url)
		return url
	}

	#revokePreview(hash: string) {
		const url = this.#objectUrls.get(hash)
		if (url) {
			URL.revokeObjectURL(url)
			this.#objectUrls.delete(hash)
		}
	}
}

const mediaFormats = new Set(["video", "image", "audio"])
const memoryIndexes = new Map<string, Kv<MediaRecord>>()

function mediaFormat(mime: string): MediaFormat {
	const [type] = mime.split("/")
	return mediaFormats.has(type) ? type as MediaFormat : "other"
}

function mediaIndex(scope: string) {
	const storage = globalThis.localStorage
	if (storage)
		return new Kv<MediaRecord>(new StorageMagazine(storage))
			.scope<MediaRecord>("quay.media")
			.scope<MediaRecord>(scope)

	const existing = memoryIndexes.get(scope)
	if (existing)
		return existing

	const index = new Kv<MediaRecord>()
	memoryIndexes.set(scope, index)
	return index
}

function trackProgress(
		readable: ReadableStream<Uint8Array>,
		onProgress: (loaded: number) => void,
	) {
	let loaded = 0
	return readable.pipeThrough(new TransformStream({
		transform(chunk, controller) {
			loaded += chunk.byteLength
			onProgress(loaded)
			controller.enqueue(chunk)
		},
	}))
}
