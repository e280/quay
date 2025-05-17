
import {html, shadowComponent} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"

import {findLocalGroup} from "../../utils/find-local-group.js"

export const QuayDropzone = shadowComponent(use => {
	use.styles(themeCss, styleCss)

	const group = findLocalGroup(use.element)
	const {dropzone, config: {root}} = group

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

