
import {signal} from "@benev/slate"
import {Codex} from "../codex.js"
import {Id, Kind, Schema} from "./types.js"

/**
 * Codex Item
 * 	- Quay's concept of a nestable thing.
 * 	- ergonomic handle which consolidates taxonomy, clade, and hierarchy functionality.
 */
export class CodexItem<Sc extends Schema, K extends Kind<Sc> = Kind<Sc>> {
	signal = signal(this)

	constructor(
		private codex: Codex<Sc>,
		public id: Id,
	) {}

	get kind(): K {
		return this.codex.clade.query<K>(this.id).kind
	}

	/** get information about the type of entity */
	get taxon(): Sc["taxon"] {
		return this.codex.clade.query(this.id).taxon
	}

	/** get information about this specific entity */
	get specimen(): Sc["specimens"][K] {
		return this.codex.clade.query<K>(this.id).specimen
	}

	/** get this item's parent item, or undefined if it's not attached */
	get parent(): CodexItem<Sc> | undefined {
		const parent = this.codex.hierarchy.getParent(this.id)
		return parent
			? this.codex.require(parent) as CodexItem<Sc>
			: undefined
	}

	/** get an array of this item's children */
	get children(): CodexItem<Sc>[] {
		// TODO actually replace this with a children() iterator, could be a perf win for supermassive sets
		return [...this.codex.hierarchy.getChildren(this.id)]
			.map(id => this.codex.require(id))
	}

	/** add items as children */
	attach(...items: CodexItem<Sc>[]) {
		this.codex.hierarchy.attach(this.id, ...items.map(i => i.id))
		this.signal.publish()
		return this
	}

	/** detach this item from the hierarchy completely */
	detach() {
		this.codex.hierarchy.detach(this.id)
		this.signal.publish()
	}

	/** create a new item that will be a child */
	create<K extends keyof Sc["specimens"]>(kind: K, specimen: Sc["specimens"][K]) {
		const item = this.codex.create(kind, specimen)
		this.attach(item)
		return item
	}

	/** create a new item that will be a child */
	destroy() {
		this.codex.hierarchy.destroy(this.id)
		this.signal.publish()
	}

	/** iterate over this item and all its descendants */
	*crawl(predicate: (item: CodexItem<Sc>, path: CodexItem<Sc>[]) => boolean = () => true) {
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
			] as [CodexItem<Sc>, CodexItem<Sc>[]]
	}
}

