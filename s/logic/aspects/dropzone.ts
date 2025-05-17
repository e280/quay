
import {pub} from "@e280/stz"
import {ShockDragDrop, signal} from "@benev/slate"
import {CodexItem} from "./codex/parts/codex-item.js"

export class Dropzone {
	#drag_drop = new ShockDragDrop<CodexItem, CodexItem>({
		handle_drop: (_e, g, h) => {this.onDrop(g, h)}
	})

	onImport = pub<[files: File[], targetFolder?: CodexItem]>(() => this.onChange.pub())
	onDrop = pub<[grabbedItem: CodexItem, targetFolder?: CodexItem]>(() => this.onChange.pub())
	onChange = pub()

	// to make drop file to import ui work
	#hovering = signal<CodexItem | undefined>(undefined)

	get grabbed() {
		return this.#drag_drop.grabbed
	}

	get hovering() {
		return this.#drag_drop.hovering ?? this.#hovering.value
	}

	dragenter = (e: DragEvent, target?: CodexItem) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragenter()(e)
		this.#hovering.value = target
	}

	dragleave = (e: DragEvent) => {
		this.#drag_drop.dropzone.dragleave()(e)
		this.#hovering.value = undefined
	}

	dragstart = (e: DragEvent, n: CodexItem) => {
		e.stopPropagation()
		this.#drag_drop.dragzone.dragstart(n)(e)
	}

	dragover = (e: DragEvent, n: CodexItem) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragover(n)(e)
	}

	dragend = (e: DragEvent) => {
		this.#drag_drop.dragzone.dragend()(e)
		this.#hovering.value = undefined
	}

	drop = (e: DragEvent, target: CodexItem) => {
		e.preventDefault()
		const files = Array.from(e.dataTransfer?.files || [])

		if (files.length) {
			this.onImport(files, target)
		}

		const same = this.grabbed?.id === this.hovering?.id
		const child = this.grabbed?.children.some(c => this.hovering?.id === c.id)
		const parent = this.grabbed?.parent?.id === this.hovering?.id

		if(!same && !child && !parent)
			this.#drag_drop.dropzone.drop(target)(e)

		this.#hovering.value = undefined
	}

	change = (e: DragEvent, targetFolder: CodexItem) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.onImport(files, targetFolder)
		}
	}
}

