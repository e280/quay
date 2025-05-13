import {pub} from "@e280/stz"
import {ShockDragDrop} from "@benev/slate"
import {MediaSchema} from "./types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

type Item = CodexItem<MediaSchema>

export class Dropzone {
	#drag_drop = new ShockDragDrop<Item, Item>({handle_drop: (e, g, h) => {this.onDrop(g, h)}})
	onImport = pub<[files: File[], targetFolder?: Item]>(() => this.onChange.pub())
	onDrop = pub<[grabbedItem: Item, targetFolder?: Item]>(() => this.onChange.pub())
	onChange = pub()

	get grabbed() {
		return this.#drag_drop.grabbed
	}

	get hovering() {
		return this.#drag_drop.hovering
	}

	dragenter = (e: DragEvent, target?: string) => e.preventDefault()

	dragleave = (e: DragEvent) => this.#drag_drop.dropzone.dragleave()(e)

	dragstart = (e: DragEvent, n: Item) => {
		e.stopPropagation()
		this.#drag_drop.dragzone.dragstart(n)(e)
	}

	dragover = (e: DragEvent, n: Item) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragover(n)(e)
	}

	dragend = (e: DragEvent) => this.#drag_drop.dragzone.dragend()(e)

	drop = (e: DragEvent, n: Item) => {
		e.preventDefault()
		const files = Array.from(e.dataTransfer?.files || [])

		if (files.length) {
			this.onImport(files, n)
		}

		const same = this.grabbed?.id === this.hovering?.id
		const child = this.grabbed?.children.some(c => this.hovering?.id === c.id)
		const parent = this.grabbed?.parent?.id === this.hovering?.id

		if(!same && !child && !parent)
			this.#drag_drop.dropzone.drop(n)(e)
	}

	change = (e: DragEvent) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.onImport(files)
		}
	}
}
