
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

	get taxon(): Sc["taxon"] {
		return this.codex.clade.query(this.id).taxon
	}

	get specimen(): Sc["specimens"][K] {
		return this.codex.clade.query<K>(this.id).specimen
	}

	get parent(): CodexItem<Sc> | undefined {
		const parent = this.codex.hierarchy.getParent(this.id)
		return parent
			? this.codex.require(parent) as CodexItem<Sc>
			: undefined
	}

	add(...items: CodexItem<Sc>[]) {
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

