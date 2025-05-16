import {html, shadowComponent} from "@benev/slate"
import {Tree} from "../../views/tree/component.js"
import {useQuayGroup} from "../../utils/use-quay-group.js"

export const QuayOutliner = shadowComponent(use => {
	const context = useQuayGroup(use)
	use.styles(context.theme)

	return html`
		<div class="panel">
			${Tree([context])}
		</div>`
})
