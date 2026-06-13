
export type Forklift = {
	list(): AsyncIterable<string>
	has(label: string): Promise<boolean>
	save(label: string, file: Blob): Promise<void>
	load(label: string): Promise<Blob>
	delete(label: string): Promise<void>
}

