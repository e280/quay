
export type Forklift = {
	list(): AsyncIterable<string>
	has(label: string): Promise<boolean>
	load(label: string): Promise<Blob>
	delete(label: string): Promise<void>
	write(readable: ReadableStream<Uint8Array>): Promise<string>
}

