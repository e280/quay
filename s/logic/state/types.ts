
export type Id = string

export type ItemPickle<S> = {
	id: Id
	scheme: S
	children: string[]
}

export type StatePickle<P> = {
	rootId: string
	items: ItemPickle<P>[]
}

