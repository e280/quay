
import {Comrade} from "@e280/comrade"
import {Hex} from "@e280/stz"
import {blake3} from "@awasm/noble"
import {TurboSchematic} from "./schematic.js"

let directory: FileSystemDirectoryHandle

await Comrade.worker<TurboSchematic>(() => {
	return {
		async setup(dirname) {
			const root = await navigator.storage.getDirectory()
			directory = await root.getDirectoryHandle(dirname, {create: true})
		},

		async write(readable) {
			const id = Hex.random()
			try {
				const file = await directory.getFileHandle(id, {create: true})
				const writable = await file.createWritable()
				const hasher = blake3.create()
				const hashing = new TransformStream<Uint8Array, Uint8Array>({
					transform(chunk, controller) {
						hasher.update(chunk)
						controller.enqueue(chunk)
					},
				})
				await readable.pipeThrough(hashing).pipeTo(writable)
				return {id, hash: Hex.fromBytes(hasher.digest())}
			}
			catch (error) {
				await directory.removeEntry(id)
				throw error
			}
		},
	}
})

