
import {MapG} from "@e280/stz"
import {Id} from "./types.js"

/** tree of nestable things */
export class Hierarchy {
	#children = new MapG<Id, Set<Id>>()
	#parents = new MapG<Id, Id>()

	has(id: Id) {
		return this.#children.has(id)
	}

	getChildren(id: Id) {
		return this.#children.require(id)
	}

	getParent(id: Id) {
		return this.#parents.get(id)
	}

	detach(id: Id) {
		if (!this.has(id))
			return undefined
		const parent = this.getParent(id)
		if (parent) {
			const siblings = this.getChildren(parent)
			siblings.delete(id)
			this.#parents.delete(id)
		}
	}

	destroy(id: Id) {
		const tree = [...this.crawl(id)]
		for (const [id] of tree) {
			this.#children.delete(id)
			this.#parents.delete(id)
		}
	}

	insertRoot(root: Id) {
		this.#children.set(root, new Set())
	}

	insert(parent: Id, ...children: Id[]) {
		const siblings = this.getChildren(parent)
		for (const childId of children) {
			if (this.getParent(childId))
				throw new Error(`child already has parent`)
			siblings.add(childId)
			this.#parents.set(childId, parent)
			this.#children.set(childId, new Set())
		}
	}

	*crawl(id: Id, predicate: (id: Id, path: Id[]) => boolean = () => true) {
		const todo: [Id, Id[]][] = [[id, []]]
		const seen = new Set<Id>()

		while (todo.length) {
			const [id, path] = todo.shift()!
			if (seen.has(id) || !predicate(id, path)) continue
			seen.add(id)

			yield [id, path] as [Id, Id[]]

			for (const childId of this.getChildren(id))
				todo.push([childId, [...path, id]])
		}
	}
}

