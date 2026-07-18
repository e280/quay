
import {Hex} from "@e280/stz"
import {blake3} from "@awasm/noble"

/** File with a hash label */
export class Cask {
	static async hash(stream: ReadableStream<Uint8Array>) {
		const hasher = blake3.create()

		for await (const chunk of stream) {
			hasher.update(chunk)
		}

		return Hex.fromBytes(hasher.digest())
	}

	static async make(file: Blob) {
		return new this(await this.hash(file.stream()), file)
	}

	static async verify(file: Blob, expectedHash: string) {
		const hash = await this.hash(file.stream())
		return hash === expectedHash
	}

	constructor(public hash: string, public file: Blob) {}
}

