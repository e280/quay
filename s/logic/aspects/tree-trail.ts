import {signal} from "@benev/slate"
import {Schema} from "./codex/parts/types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

export class TreeTrail<Sc extends Schema> {
	readonly signal = signal<CodexItem<Sc>[]>([])

	constructor(root: CodexItem<Sc>) {
		this.signal.value = [root]
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

		this.signal.value = trail
	}

	get currentFolder() {
		return this.signal.value.at(-1)?.children ?? []
	}
}

