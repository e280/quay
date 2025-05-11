import {signal} from "@benev/slate"

export class Dropzone {
	readonly dropTarget = signal<string | undefined | "quay-dropzone">(undefined)
	onFilesDropped: (files: File[], folderId?: string) => void = () => {}

	dragenter = (e: DragEvent, target?: string) => {
		e.preventDefault()
		this.dropTarget.value = target ?? "quay-dropzone"
	}

	dragleave = (e: DragEvent) => {
		this.dropTarget.value = undefined
	}

	dragover = (e: DragEvent) => e.preventDefault()

	drop = (e: DragEvent) => {
		e.preventDefault()

		const files = Array.from(e.dataTransfer?.files || [])
		if (files.length)
			this.onFilesDropped(files, this.dropTarget.value)

		this.dropTarget.value = undefined
	}

	change = (e: DragEvent) => {
		const input = e.currentTarget as HTMLInputElement
		const files = Array.from(input.files ?? [])

		if (files.length) {
			this.onFilesDropped(files)
		}
	}
}
