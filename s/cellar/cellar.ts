
import {Mammoth} from "@e280/mammoth"

import {Cask} from "./cask.js"
import {MammothOpfs} from "./mammoth.js"

/**
 * Cellar is an immutable content-addressable file store
 *  - files are identified by their hashes (duplicates are impossible)
 *  - files cannot be modified (delete it and save another)
 *  - no filenames or metadata (store those somewhere else)
 *  - new Cellar uses Mammoth's in-memory backend by default
 *  - Cellar.opfs creates MammothOpfs for persistent browser storage
 *  - pass in a Mammoth to use a different backend
 *  - most likely you want to use Cellar.opfs for storing files in the browser
 */
export class Cellar {
	static async opfs(dirname = "cellar") {
		return new this(await MammothOpfs.setup(dirname))
	}

	constructor(private mammoth: Mammoth | MammothOpfs = new Mammoth()) {}

	async *list(): AsyncIterable<string> {
		for await (const [hash] of this.mammoth.entries())
			yield hash
	}

	async has(hash: string): Promise<boolean> {
		return this.mammoth.has(hash)
	}

	async write(readable: ReadableStream<Uint8Array>) {
		return this.mammoth.write(readable)
	}

	async load(hash: string): Promise<Cask> {
		return new Cask(hash, await this.mammoth.read(hash))
	}

	async delete(hash: string) {
		await this.mammoth.delete(hash)
	}

	async clear() {
		for await (const hash of this.list())
			await this.delete(hash)
	}
}

