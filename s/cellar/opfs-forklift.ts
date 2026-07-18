
import {Kv, StorageDriver} from "@e280/kv"

import {Forklift} from "./forklift.js"
import {Turbo} from "../genius/turbo/turbo.js"

export class OpfsForklift implements Forklift {
	static async setup(dirname: string) {
		const root = await navigator.storage.getDirectory()
		const directory = await root.getDirectoryHandle(dirname, {create: true})
		const ids = new Kv<string>(new StorageDriver(localStorage))
			.scope("quay.cellar")
			.scope(dirname)
		return new this(directory, ids, await Turbo.setup(dirname))
	}

	constructor(
		private directory: FileSystemDirectoryHandle,
		private ids: Kv<string>,
		private turbo: Turbo,
	) {}

	async *list(): AsyncIterable<string> {
		yield* this.ids.keys()
	}

	async has(label: string): Promise<boolean> {
		return this.ids.has(label)
	}

	async write(readable: ReadableStream<Uint8Array>): Promise<string> {
		const {hash, id} = await this.turbo.write(readable)
		if (await this.ids.has(hash))
			await this.directory.removeEntry(id)
		else
			await this.ids.set(hash, id)
		return hash
	}

	async load(label: string): Promise<Blob> {
		const fileHandle = await this.directory.getFileHandle(await this.ids.require(label))
		return fileHandle.getFile()
	}

	async delete(label: string) {
		const id = await this.ids.require(label)
		await this.directory.removeEntry(id)
		await this.ids.del(label)
	}
}
