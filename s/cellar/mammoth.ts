
import {Comrade, Thread, tune, AsSchematic} from "@e280/comrade"

export type MammothSchematic = AsSchematic<{
	work: {
		setup(dirname: string): Promise<void>
		write(readable: ReadableStream<Uint8Array>): Promise<string>
		has(hash: string): Promise<boolean>
		read(hash: string): Promise<Blob>
		delete(hash: string): Promise<void>
		hashes(): Promise<string[]>
	}
	host: {}
}>

/** Worker proxy for Mammoth using an OPFS bucket and IndexedDB manifest. */
export class MammothOpfs {
	static async setup(dirname: string) {
		const thread = await Comrade.thread<MammothSchematic>({
			workerUrl: "/node_modules/@e280/quay/x/cellar/mammoth.worker.bundle.min.js",
			setupHost: () => ({}),
		})
		const mammoth = new this(thread)
		await mammoth.thread.work.setup(dirname)
		return mammoth
	}

	constructor(private thread: Thread<MammothSchematic>) {}

	async write(readable: ReadableStream<Uint8Array>) {
		return this.thread.work.write[tune]({transfer: [readable]})(readable)
	}

	async has(hash: string) {
		return this.thread.work.has(hash)
	}

	async read(hash: string) {
		return this.thread.work.read(hash)
	}

	async delete(hash: string) {
		return this.thread.work.delete(hash)
	}

	async *entries(): AsyncIterable<[string, unknown]> {
		for (const hash of await this.thread.work.hashes())
			yield [hash, undefined]
	}
}
