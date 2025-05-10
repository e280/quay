
import {MapG} from "@e280/stz"

import {Item} from "./parts/item.js"
import {Clade} from "./parts/clade.js"
import {Taxonomy} from "./parts/taxonomy.js"
import {Hierarchy} from "./parts/hierarchy.js"
import {generateId} from "./utils/generate-id.js"
import {Id, Schema, Taxons} from "./parts/types.js"

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
}

