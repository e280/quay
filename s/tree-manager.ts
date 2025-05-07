import {TreeItem} from "./types.js"
import {Emitter} from "./utils/emitter.js"

export class TreeManager extends Emitter {
	#items = new Map<string, TreeItem>()

	create = (item: TreeItem) => {
		this.#items.set(item.id, item)
		this.emit()
	}

	update = (id: string, patch: Partial<TreeItem>) => {
		const current = this.#items.get(id)
		if (!current) return
		this.#items.set(id, {...current, ...patch})
		this.emit()
	}

	remove = (id: string) => {
		this.#items.delete(id)
		this.emit()
	}

	move = (id: string, parentId: string | null, sortIndex: number) =>
		this.update(id, {parentId, sortIndex})

	getAll = () => Array.from(this.#items.values()).sort((a, b) => a.sortIndex - b.sortIndex)
}
