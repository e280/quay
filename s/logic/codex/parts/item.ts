
import {signal} from "@benev/slate"
import {Codex} from "../codex.js"
import {Id, Kind, Schema} from "./types.js"

/** a codex item, ergonomic handle for items that have a taxon, specimen, and position in hierarchy */
export class Item<Sc extends Schema, K extends Kind<Sc> = Kind<Sc>> {
	signal = signal(this)

	constructor(
		private codex: Codex<Sc>,
		public id: Id,
		public kind: K,
		public taxon: Sc["taxon"],
		public specimen: Sc["specimens"][K],
	) {}

	get parent(): Item<Sc> | undefined {
		const parent = this.codex.hierarchy.getParent(this.id)
		return parent
			? this.codex.require(parent) as Item<Sc>
			: undefined
	}

	add(...items: Item<Sc>[]) {
		this.codex.hierarchy.insert(this.id, ...items.map(i => i.id))
		this.signal.publish()
		return this
	}

	create<K extends keyof Sc["specimens"]>(kind: K, specimen: Sc["specimens"][K]) {
		const item = this.codex.create(kind, specimen)
		this.add(item)
		return item
	}

	detach() {
		this.codex.hierarchy.detach(this.id)
		this.signal.publish()
	}

	destroy() {
		this.codex.hierarchy.destroy(this.id)
		this.signal.publish()
	}

	*crawl(predicate: (item: Item<Sc>, path: Item<Sc>[]) => boolean = () => true) {
		const iterator = this.codex.hierarchy.crawl(
			this.id,
			(id, path) => predicate(
				this.codex.require(id),
				path.map(id => this.codex.require(id)),
			)
		)
		for (const [id, path] of iterator)
			yield [
				this.codex.require(id),
				path.map(id => this.codex.require(id)),
			] as [Item<Sc>, Item<Sc>[]]
	}
}

