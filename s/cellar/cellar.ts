
import {Cask} from "./cask.js"
import {Forklift} from "./forklift.js"
import {OpfsForklift} from "./opfs-forklift.js"
import {MemoryForklift} from "./memory-forklift.js"

/**
 * Cellar is an immutable content-addressable file store
 *  - files are identified by their hashes (duplicates are impossible)
 *  - files cannot be modified (delete it and save another)
 *  - no filenames or metadata (store those somewhere else)
 *  - pass in a forklift, which is the backend that actually stores the data
 *    - MemoryForklift is the default
 *    - OpfsForklift is probably what you really want in the browser
 */
export class Cellar {
	static async opfs(dirname = "cellar") {
		return new this(await OpfsForklift.setup(dirname))
	}

	constructor(private forklift: Forklift = new MemoryForklift()) {}

	async *list(): AsyncIterable<string> {
		yield* this.forklift.list()
	}

	async has(hash: string): Promise<boolean> {
		return this.forklift.has(hash)
	}

	async save(bytes: Uint8Array) {
		const cask = await Cask.make(bytes)
		if (!await this.forklift.has(cask.hash))
			await this.forklift.save(cask.hash, cask.bytes)
		return cask
	}

	async load(hash: string): Promise<Cask> {
		const bytes = await this.forklift.load(hash)
		const cask = await Cask.make(bytes)
		if (cask.hash !== hash) throw new Error(`corruption error, hash mismatch (requested ${hash}) (got ${cask.hash})`)
		return cask
	}

	async delete(hash: string) {
		await this.forklift.delete(hash)
	}

	async clear() {
		for await (const hash of this.list())
			await this.delete(hash)
	}
}

