
import {MapG} from "@e280/stz"
import {signal} from "@benev/slate"

import {Item} from "./item.js"
import {Id, StatePickle} from "./types.js"

export class State<S> {
	static init<S>(rootScheme: S) {
		const state = new this<S>(rootScheme)
		const root = new Item(state, Item.randomId(), signal(rootScheme), new Set())
		const items = new MapG([[root.id, root]])
		state.#rootId = root.id
		state.#items = items
		return state
	}

	#rootId: Id
	#items: MapG<Id, Item<S>>
	signal = signal(this)

	constructor(rootScheme: S) {
		const root = new Item(this, Item.randomId(), signal(rootScheme), new Set())
		this.#rootId = root.id
		this.#items = new MapG([[root.id, root]])
	}

	clear() {
		this.#items = new MapG([[this.root.id, this.root]])
		this.signal.publish()
	}

	unpickle(pickle: StatePickle<S>) {
		const rootId = pickle.rootId
		const items = new MapG(
			pickle.items
				.map(p => Item.unpickle(this, p))
				.map(item => [item.id, item])
		)
		if (!items.has(rootId))
			throw new Error(`rootId not in items "${rootId}"`)
		this.#rootId = rootId
		this.#items = items
		this.signal.publish()
	}

	pickle(): StatePickle<S> {
		return {
			rootId: this.#rootId,
			items: [...this.#items.values()]
				.map(item => item.pickle()),
		}
	}

	get rootId() {
		return this.#rootId
	}

	set rootId(id: Id) {
		this.require(id)
		this.#rootId = id
		this.signal.publish()
	}

	get root() {
		return this.require(this.#rootId)
	}

	get(id: Id) {
		return this.#items.get(id)
	}

	require(id: Id) {
		return this.#items.require(id)
	}

	iterate() {
		return this.#items.values()
	}

	*crawl(item: Item<S> = this.root) {
		const todo: [Item<S>, Item<S>[]][] = [[item, []]]
		const seen = new Set<Item<S>>()
		while (todo.length) {
			const [item, path] = todo.shift()!
			if (seen.has(item)) continue
			seen.add(item)
			yield [item, path] as [Item<S>, Item<S>[]]
			if (item.children) {
				for (const childId of item.children) {
					const child = this.require(childId)
					todo.push([child, [...path, item]])
				}
			}
		}
	}

	make<S2 extends S>(scheme: S2) {
		const id = Item.randomId()
		const item = new Item(this, id, signal(scheme), new Set())
		this.#items.set(id, item)
		this.signal.publish()
		return item
	}

	insert<S2 extends S>(parent: Item<S>, scheme: S2) {
		const item = this.make(scheme)
		parent.add(item)
		this.signal.publish()
		return item
	}

	del(unwanted: Item<S>) {
		for (const item of this.#items.values()) {
			if (item.children)
				item.children.delete(unwanted.id)
		}
		this.signal.publish()
		return this
	}
}

