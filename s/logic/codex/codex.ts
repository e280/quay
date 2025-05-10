
import {MapG} from "@e280/stz"
import {signal} from "@benev/slate"

import {Clade} from "./parts/clade.js"
import {Taxonomy} from "./parts/taxonomy.js"
import {Hierarchy} from "./parts/hierarchy.js"
import {generateId} from "./utils/generate-id.js"
import {Id, Kind, Schema, Taxons} from "./parts/types.js"

export class Item<Sc extends Schema, K extends Kind<Sc> = Kind<Sc>> {
	signal = signal(this)

	constructor(
		private codex: Codex<any>,
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
}

export class Codex<Sc extends Schema> {
	static setup<Sc extends Schema>(taxons: Taxons<Sc>) {
		const taxonomy = new Taxonomy<Sc>(taxons)
		const clade = new Clade(taxonomy)
		const hierarchy = new Hierarchy()
		return new this(clade, hierarchy)
	}

	#items = new MapG<Id, Item<Sc>>()

	constructor(
		public clade: Clade<Sc>,
		public hierarchy: Hierarchy,
	) {}

	create<K extends keyof Sc["specimens"]>(kind: K, specimen: Sc["specimens"][K]) {
		const id = generateId()
		const taxon = this.clade.taxonomy.taxon(kind)
		this.clade.setSpecimen(id, kind, specimen)
		const item = new Item(this, id, kind, taxon, specimen)
		this.#items.set(id, item)
		return item
	}

	root<I extends Item<Sc>>(item: I) {
		this.hierarchy.insertRoot(item.id)
		return item
	}

	require(id: Id): Item<Sc> {
		return this.#items.require(id)
	}

	*crawl(startId: Id, predicate: (item: Item<Sc>, path: Item<Sc>[]) => boolean = () => true) {
		const iterator = this.hierarchy.crawl(
			startId,
			(id, path) => predicate(
				this.require(id),
				path.map(id => this.require(id)),
			)
		)
		for (const [id, path] of iterator)
			yield [this.require(id), path.map(id => this.require(id))]
	}
}

