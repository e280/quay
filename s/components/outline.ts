import {html, shadowComponent} from "@benev/slate"
import {context} from "../context.js"
import {Tree} from "./tree/component.js"

export const QuayOutliner = shadowComponent(use => {
	use.styles(context.theme)

	return html`
		<div class="panel">
			${Tree([])}
		</div>`
})
