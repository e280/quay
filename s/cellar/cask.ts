
import {Hex} from "@e280/stz"
import {blake3} from "@awasm/noble"

/** File with a hash label */
export class Cask {
	static async hash(file: Blob) {
		const hasher = blake3.create()

		for await (const chunk of file.stream())
			hasher.update(chunk)

		const digest = hasher.digest()
		return Hex.fromBytes(digest)
	}

	static async make(file: Blob) {
		const hash = await this.hash(file)
		return new this(hash, file)
	}

	constructor(public hash: string, public file: Blob) {}
}

