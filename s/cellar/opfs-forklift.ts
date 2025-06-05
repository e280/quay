
import {Forklift} from "./forklift.js"

export class OpfsForklift implements Forklift {
	static async setup(dirname: string) {
		const root = await navigator.storage.getDirectory()
		const directory = await root.getDirectoryHandle(dirname, {create: true})
		return new this(directory)
	}

	constructor(private directory: FileSystemDirectoryHandle) {}

	async *list(): AsyncIterable<string> {
		for await (const [name, handle] of this.directory.entries()) {
			if (handle.kind === "file")
				yield name
		}
	}

	async has(label: string): Promise<boolean> {
		try {
			await this.directory.getFileHandle(label)
			return true
		}
		catch (err) {
			if ((err as DOMException).name === "NotFoundError") return false
			throw err
		}
	}

	async save(label: string, bytes: Uint8Array): Promise<void> {
		const fileHandle = await this.directory.getFileHandle(label, {create: true})
		const writable = await fileHandle.createWritable()
		await writable.write(bytes)
		await writable.close()
	}

	async load(label: string): Promise<Uint8Array> {
		const fileHandle = await this.directory.getFileHandle(label)
		const file = await fileHandle.getFile()
		const buffer = await file.arrayBuffer()
		return new Uint8Array(buffer)
	}

	async delete(label: string) {
		await this.directory.removeEntry(label)
	}
}

