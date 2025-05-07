import {html, shadowComponent} from "@benev/slate"

import {Tree} from "./tree/component.js"

export const QuayOutliner = shadowComponent(use => {

	return html`
		<div class="panel">
			${Tree([])}
		</div>`
})
