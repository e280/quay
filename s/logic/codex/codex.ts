
import {MapG} from "@e280/stz"

import {Clade} from "./parts/clade.js"
import {Taxonomy} from "./parts/taxonomy.js"
import {Hierarchy} from "./parts/hierarchy.js"
import {CodexItem} from "./parts/codex-item.js"
import {generateId} from "./utils/generate-id.js"
import {Id, Schema, Taxons} from "./parts/types.js"

export class Codex<Sc extends Schema> {
	static setup<Sc extends Schema>(taxons: Taxons<Sc>) {
		const taxonomy = new Taxonomy<Sc>(taxons)
		const clade = new Clade(taxonomy)
		const hierarchy = new Hierarchy()
		return new this(clade, hierarchy)
	}

	#items = new MapG<Id, CodexItem<Sc>>()

	constructor(
		public clade: Clade<Sc>,
		public hierarchy: Hierarchy,
	) {}

	create<K extends keyof Sc["specimens"]>(kind: K, specimen: Sc["specimens"][K]) {
		const id = generateId()
		this.clade.setSpecimen(id, kind, specimen)
		const item = new CodexItem(this, id)
		this.#items.set(id, item)
		return item.signal.value
	}

	root<I extends CodexItem<Sc>>(item: I) {
		this.hierarchy.insertRoot(item.id)
		return item.signal.value
	}

	require(id: Id): CodexItem<Sc> {
		return this.#items.require(id).signal.value
	}
}

