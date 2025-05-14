import {pub} from "@e280/stz"
import {ShockDragDrop, signal} from "@benev/slate"
import {MediaSchema} from "./types.js"
import {context} from "../dom/context.js"
import {CodexItem} from "./codex/parts/codex-item.js"

type Item = CodexItem<MediaSchema>

export class Dropzone {
	#drag_drop = new ShockDragDrop<Item, Item>({handle_drop: (e, g, h) => {this.onDrop(g, h)}})
	onImport = pub<[files: File[], targetFolder?: Item]>(() => this.onChange.pub())
	onDrop = pub<[grabbedItem: Item, targetFolder?: Item]>(() => this.onChange.pub())
	onChange = pub()

	// to make drop file to import ui work
	#hovering = signal<Item | undefined>(undefined)

	get grabbed() {
		return this.#drag_drop.grabbed
	}

	get hovering() {
		return this.#drag_drop.hovering ?? this.#hovering.value
	}

	dragenter = (e: DragEvent, target?: Item) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragenter()(e)
		this.#hovering.value = target
	}

	dragleave = (e: DragEvent) => {
		this.#drag_drop.dropzone.dragleave()(e)
		this.#hovering.value = undefined
	}

	dragstart = (e: DragEvent, n: Item) => {
		e.stopPropagation()
		this.#drag_drop.dragzone.dragstart(n)(e)
	}

	dragover = (e: DragEvent, n: Item) => {
		e.preventDefault()
		this.#drag_drop.dropzone.dragover(n)(e)
	}

	dragend = (e: DragEvent) => {
		this.#drag_drop.dragzone.dragend()(e)
		this.#hovering.value = undefined
	}

	drop = (e: DragEvent, target: Item) => {
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

	change = (e: DragEvent) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.onImport(files, context.root)
		}
	}
}
