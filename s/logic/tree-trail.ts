import {signal} from "@benev/slate"
import {Schema} from "./codex/parts/types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

export class TreeTrail<Sc extends Schema> {
	readonly trail = signal<(CodexItem<Sc>)[]>([])

	constructor(root: CodexItem<Sc>) {
		this.trail.value = [root]
	}

	setTrail(e: Event, item: CodexItem<Sc>) {
		if (e.target !== e.currentTarget) return

		const trail: CodexItem<Sc>[] = []

		let cur = item.kind === "folder"
			? item
			: item.parent

		while (cur) {
			trail.unshift(cur)
			cur = cur.parent
		}

		this.trail.value = trail
	}

	get currentFolder() {
		return this.trail.value.at(-1)?.children ?? []
	}

}
