import {signal} from "@benev/slate"
import {TreeItem} from "./types.js"

export class TreeManager {
	#items = signal(new Map<string, TreeItem>())

	get items() {
		const array = [...this.#items.value.values()]
		return array.toSorted((a, b) => a.sortIndex - b.sortIndex)
	}

	create = (item: TreeItem) => {
		this.#items.value.set(item.id, item)
		this.#items.publish()
	}

	update = (id: string, patch: Partial<TreeItem>) => {
		const current = this.#items.value.get(id)
		if (!current) return
		this.#items.value.set(id, {...current, ...patch})
		this.#items.publish()
	}

	remove = (id: string) => {
		this.#items.value.delete(id)
		this.#items.publish()
	}

	move = (id: string, parentId: string | null, sortIndex: number) =>
		this.update(id, {parentId, sortIndex})
}
