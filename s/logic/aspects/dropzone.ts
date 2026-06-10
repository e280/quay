import {loot} from "@e280/sly"
import {signal} from "@e280/strata"

import {Group} from "../group.js"
import {CodexItem} from "./codex/parts/codex-item.js"

export class Dropzone {
	#drag_drop = new loot.DragAndDrops<CodexItem, CodexItem>({
		acceptDrop: (_e, grabbed, hovering) => this.group.move(grabbed, hovering)
	})

	constructor(private group: Group) {}

	// to make drop file to import ui work
	#hovering = signal<CodexItem | undefined>(undefined)

	get grabbed() {
		return this.#drag_drop.dragging
	}

	get hovering() {
		return this.#drag_drop.hovering ?? this.#hovering()
	}

	dragenter = (e: DragEvent, target: CodexItem) => {
		e.preventDefault()
		this.#drag_drop.dropzone(() => target).dragenter(e)
		this.#hovering(target)
	}

	dragleave = (e: DragEvent) => {
		const hovering = this.hovering
		if (hovering)
			this.#drag_drop.dropzone(() => hovering).dragleave(e)
		this.#hovering(undefined)
	}

	dragstart = (e: DragEvent, n: CodexItem) => {
		e.stopPropagation()
		this.#drag_drop.dragzone(() => n).dragstart(e)
	}

	dragover = (e: DragEvent, n: CodexItem) => {
		e.preventDefault()
		this.#drag_drop.dropzone(() => n).dragover(e)
	}

	dragend = (e: DragEvent) => {
		this.#drag_drop.$draggy(undefined)
		this.#drag_drop.$droppy(undefined)
		this.#hovering(undefined)
	}

	drop = (e: DragEvent, target: CodexItem) => {
		e.preventDefault()
		const files = Array.from(e.dataTransfer?.files || [])

		if (files.length) {
			this.group.upload(files, target)
		}

		const same = this.grabbed?.id === this.hovering?.id
		const child = this.grabbed?.children.some(c => this.hovering?.id === c.id)
		const parent = this.grabbed?.parent?.id === this.hovering?.id

		if(!same && !child && !parent)
			this.#drag_drop.dropzone(() => target).drop(e)

		this.#hovering(undefined)
	}

	change = (e: DragEvent, targetFolder: CodexItem) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.group.upload(files, targetFolder)
		}
	}
}

