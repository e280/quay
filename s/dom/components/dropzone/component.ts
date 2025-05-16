import {html, shadowComponent} from "@benev/slate"
import styles from "./styles.js"
import {useQuayGroup} from "../../utils/use-quay-group.js"

export const QuayDropzone = shadowComponent(use => {
	const {dropzone, theme, root} = useQuayGroup(use)
	use.styles(theme, styles)

	return html`
		<div class="dropzone" ?data-hovering=${dropzone.hovering}>
			<input
				type="file"
				class="dz-input"
				@change=${(e: DragEvent) => dropzone.change(e, root)}
				@drop=${(e: DragEvent) => dropzone.drop(e, root)}
				@dragover=${(e: DragEvent) => dropzone.dragover(e, root)}
				@dragenter=${(e: DragEvent) => dropzone.dragenter(e, root)}
				@dragleave=${dropzone.dragleave}
			>
			<div class=dz-info>
				<sl-icon name="upload"></sl-icon>
				Drop files here
			</div>
		</div>
	`
})
