import {html, shadowComponent} from "@benev/slate"
import styles from "./styles.js"
import {context} from "../../context.js"

export const QuayDropzone = shadowComponent(use => {
	const {dropzone, theme} = context

	use.styles(theme, styles)

	return html`
		<div class="dropzone ${dropzone.dropTarget.value === "quay-dropzone" ? 'hovering' : ''}">
			<input
				type="file"
				class="dz-input"
				@change=${dropzone.change}
				@drop=${dropzone.drop}
				@dragover=${dropzone.dragover}
				@dragenter=${dropzone.dragenter}
				@dragleave=${dropzone.dragleave}
			>
			<div class=dz-info>
				<sl-icon name="upload"></sl-icon>
				Drop files here
			</div>
		</div>
	`
})
