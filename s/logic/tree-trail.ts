import {signal} from "@benev/slate"
import {MediaSchema} from "./types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

export class TreeTrail {
	readonly trail = signal<(CodexItem<MediaSchema>)[]>([])

	constructor(root: CodexItem<MediaSchema>) {
		this.trail.value = [root]
	}

	setTrail(e: Event, item: CodexItem<MediaSchema>) {
		if (e.target !== e.currentTarget) return

		const trail: CodexItem<MediaSchema>[] = []

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
