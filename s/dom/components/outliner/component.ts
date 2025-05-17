
import {html, shadowComponent} from "@benev/slate"
import themeCss from "../../theme.css.js"
import {Tree} from "../../views/tree/component.js"
import {findLocalGroup} from "../../utils/find-local-group.js"

export const QuayOutliner = shadowComponent(use => {
	use.styles(themeCss)
	const group = findLocalGroup(use.element)

	return html`
		<div class="panel">
			${Tree([group])}
		</div>`
})

