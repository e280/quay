
import {MapG} from "@e280/stz"
import {Forklift} from "./forklift.js"

export class MemoryForklift implements Forklift {
	#map = new MapG<string, Uint8Array>()

	async *list(): AsyncIterable<string> {
		for (const label of this.#map.keys())
			yield label
	}

	async has(label: string): Promise<boolean> {
		return this.#map.has(label)
	}

	async save(label: string, bytes: Uint8Array): Promise<void> {
		this.#map.set(label, bytes)
	}

	async load(label: string): Promise<Uint8Array> {
		return this.#map.require(label)
	}

	async delete(label: string) {
		this.#map.delete(label)
	}
}

