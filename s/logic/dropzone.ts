import {ShockDragDrop} from "@benev/slate"
import {NestedTreeItem} from "./types.js"

export class Dropzone {
	#drag_drop = new ShockDragDrop<NestedTreeItem, NestedTreeItem>({handle_drop: (e, g, h) => {this.onDrop(g, h)}})
	onDrop: (draggedItem: NestedTreeItem, targetId?: NestedTreeItem) => void = () => {}
	onImport: (files: File[], folder?: NestedTreeItem) => void = () => {}

	get grabbed() {
	 return this.#drag_drop.grabbed
	}

	get hovering() {
	 return this.#drag_drop.hovering
	}

	dragenter = (e: DragEvent, target?: string) => {
		e.preventDefault()
	}

	dragleave = (e: DragEvent) => {
		this.#drag_drop.dropzone.dragleave()(e)
	}

	dragstart = (e: DragEvent, n: NestedTreeItem) => {
		e.stopPropagation()
		this.#drag_drop.dragzone.dragstart(n)(e)
	}

	dragover = (e: DragEvent, n: NestedTreeItem) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragover(n)(e)
	}

	dragend = (e: DragEvent) => {
		this.#drag_drop.dragzone.dragend()(e)
	}

	drop = (e: DragEvent, n: NestedTreeItem) => {
		e.preventDefault()
		const files = Array.from(e.dataTransfer?.files || [])

		if (files.length) {
			this.onImport(files, n)
		}

		const same = this.grabbed?.id === this.hovering?.id
		const child = this.grabbed?.children.some(c => this.hovering?.id === c.id)

		if(!same && !child)
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
