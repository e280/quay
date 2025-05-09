
import {Hex} from "@e280/stz"
import {signal, Signal} from "@benev/slate"

import {State} from "./state.js"
import {Id, ItemPickle} from "./types.js"

export class Item<S> {
	static randomId = () => Hex.random()

	static unpickle = <S>(state: State<S>, pickle: ItemPickle<S>) => {
		const scheme = signal(pickle.scheme)
		return new this<S>(state, pickle.id, scheme, new Set(pickle.children))
	}

	constructor(
		private state: State<S>,
		public id: Id,
		public scheme: Signal<S>,
		public children: Set<Id>,
	) {}

	pickle(): ItemPickle<S> {
		return {
			id: this.id,
			scheme: this.scheme.value,
			children: [...this.children],
		}
	}

	add(...items: Item<S>[]) {
		for (const item of items) {
			if (this.children === undefined)
				throw new Error(`item does not allow children "${this.id}"`)
			if (this.id === item.id)
				throw new Error(`item cannot be its own parent "${this.id}"`)
			this.children.add(item.id)
		}
		this.state.signal.publish()
		return this
	}

	remove(...items: Item<S>[]) {
		for (const item of items)
			this.children.delete(item.id)
		this.state.signal.publish()
		return this
	}
}

