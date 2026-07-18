
import {Comrade, Thread, tune} from "@e280/comrade"
import {TurboSchematic} from "./schematic.js"

export class Turbo {
	static async setup(dirname: string) {
		const thread = await Comrade.thread<TurboSchematic>({
			workerUrl: "/node_modules/@e280/quay/x/genius/turbo/worker.bundle.min.js",
			setupHost: () => ({}),
		})
		const turbo = new this(thread)
		await turbo.thread.work.setup(dirname)
		return turbo
	}

	constructor(private thread: Thread<TurboSchematic>) {}

	async write(readable: ReadableStream<Uint8Array>) {
		return this.thread.work.write[tune]({transfer: [readable]})(readable)
	}
}
