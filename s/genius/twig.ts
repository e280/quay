
/**
 * 🌿 Async source for loading items into Quay.
 * - crawlable and callable by the ui
 * - the functions provided are available for the ui user
 * - as we crawl, every item we see is cached for sync rendering
 * - minimal so as to be compatible even with raw opfs
 * - Opfs, Cellar, etc, will literally provide Twig implementations
 */
export type Twig<T extends Twig = any> = {
	readonly id: string
	name: string
	parent: T | null

	rename?: (name: string) => Promise<void>
	delete?: () => Promise<void>
	move?: (o: {parent: T}) => Promise<void>
	copy?: (o: {parent: T, name: string}) => Promise<void>

	container?: {
		create(o: CreationOptions): Promise<T>
		children(o?: ListingOptions): Promise<T[]>
		crawl(predicate: (item: T, ancestors: T[]) => Promise<boolean>): AsyncIterable<T>
	}
}

export type Lens<T extends Twig = any> = (item: T) => boolean
export type WritingOptions = {}
export type ReadingOptions = {}
export type CreationOptions = {}
export type ListingOptions<T extends Twig = any> = {
	lens?: Lens<T>
}

