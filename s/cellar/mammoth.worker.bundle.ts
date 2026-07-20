
import {collect} from "@e280/stz"
import {Comrade} from "@e280/comrade"
import {Mammoth, OpfsBucket} from "@e280/mammoth"
import {idbOpen, IdbMagazine, Kv} from "@e280/kv"

import type {MammothSchematic} from "./mammoth.js"

let mammoth: Mammoth

await Comrade.worker<MammothSchematic>(() => ({
	async setup(dirname) {
		const root = await navigator.storage.getDirectory()
		const directory = await root.getDirectoryHandle(dirname, {create: true})
		mammoth = new Mammoth(
			new OpfsBucket(directory),
			new Kv(new IdbMagazine(await idbOpen(`quay.mammoth:${dirname}`))),
		)
	},

	write: readable => mammoth.write(readable),
	has: hash => mammoth.has(hash),
	read: hash => mammoth.read(hash),
	delete: hash => mammoth.delete(hash),

	async hashes() {
		return (await collect(mammoth.entries())).map(([hash]) => hash)
	},
}))

