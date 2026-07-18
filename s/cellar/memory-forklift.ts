
import {MapG} from "@e280/stz"
import {Cask} from "./cask.js"
import {Forklift} from "./forklift.js"

export class MemoryForklift implements Forklift {
	#map = new MapG<string, Blob>()

	async *list(): AsyncIterable<string> {
		for (const label of this.#map.keys())
			yield label
	}

	async has(label: string): Promise<boolean> {
		return this.#map.has(label)
	}

	async write(readable: ReadableStream<Uint8Array>): Promise<string> {
		const [forHash, forFile] = readable.tee()
		const [hash, file] = await Promise.all([
			Cask.hash(forHash),
			new Response(forFile).blob(),
		])
		this.#map.set(hash, file)
		return hash
	}

	async load(label: string): Promise<Blob> {
		return this.#map.require(label)
	}

	async delete(label: string) {
		this.#map.delete(label)
	}
}

