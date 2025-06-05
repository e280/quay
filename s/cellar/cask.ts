
import {Hex} from "@e280/stz"

/** File with a hash label */
export class Cask {
	static async hash(bytes: Uint8Array) {
		const hashBuffer = await crypto.subtle.digest("SHA-256", bytes)
		return Hex.fromBytes(new Uint8Array(hashBuffer))
	}

	static async make(bytes: Uint8Array) {
		const hash = await this.hash(bytes)
		return new this(hash, bytes)
	}

	constructor(public hash: string, public bytes: Uint8Array) {}
}

