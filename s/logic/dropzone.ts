import {signal} from "@benev/slate"

export class Dropzone {
	readonly hovering = signal(false)

	onFilesDropped: (files: File[]) => void = () => {}

	dragenter = (e: DragEvent) => {
		e.preventDefault()
		this.hovering.value = true
	}

	dragleave = (e: DragEvent) => {
		this.hovering.value = false
	}

	dragover = (e: DragEvent) => e.preventDefault()

	drop = (e: DragEvent) => {
		e.preventDefault()
		this.hovering.value = false

		const files = Array.from(e.dataTransfer?.files || [])
		if (files.length)
			this.onFilesDropped(files)
	}

	change = (e: DragEvent) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.onFilesDropped(files)
		}
	}
}
