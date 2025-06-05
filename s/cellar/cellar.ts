
import {Cask} from "./cask.js"
import {Forklift} from "./forklift.js"
import {OpfsForklift} from "./opfs-forklift.js"

/**
 * Cellar is an immutable content-addressable file store
 *  - files are identified by their hashes (duplicates are impossible)
 *  - files cannot be modified (delete it and save another)
 *  - no filenames or metadata (store those somewhere else)
 */
export class Cellar {
	static async opfs(dirname = "cellar") {
		return new this(await OpfsForklift.setup(dirname))
	}

	constructor(private forklift: Forklift) {}

	async has(hash: string): Promise<boolean> {
		return this.forklift.has(hash)
	}

	async save(cask: Cask) {
		if (!await this.forklift.has(cask.hash))
			await this.forklift.save(cask.hash, cask.bytes)
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
}

