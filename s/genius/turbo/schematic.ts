
import {AsSchematic} from "@e280/comrade"

export type TurboSchematic = AsSchematic<{
	work: {
		setup(dirname: string): Promise<void>
		write(readable: ReadableStream<Uint8Array>): Promise<{hash: string, id: string}>
	}
	host: {}
}>
