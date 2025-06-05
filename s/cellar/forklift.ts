
export type Forklift = {
	list(): AsyncIterable<string>
	has(label: string): Promise<boolean>
	save(label: string, bytes: Uint8Array): Promise<void>
	load(label: string): Promise<Uint8Array>
	delete(label: string): Promise<void>
}

