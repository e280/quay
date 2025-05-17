
import {html, shadowComponent} from "@benev/slate"

import themeCss from "../../theme.css.js"

import {findLocalGroup} from "../../utils/find-local-group.js"
import {CodexItem} from "../../../logic/aspects/codex/parts/codex-item.js"

export const QuayBreadcrumb = shadowComponent(use => {
	use.css(themeCss)

	const group = findLocalGroup(use.element)
	const {trail, config: {codex, renderLabel}} = group

	const click = (item: CodexItem) => (e: Event) => group.trail.setTrail(e, item)

	return html`
		<sl-breadcrumb>
			${trail.signal.value.map(item => html`
				<sl-breadcrumb-item @click="${click}">
					${item === null
						? "root"
						: renderLabel(codex.require(item.id))}
				</sl-breadcrumb-item>
			`)}
		</sl-breadcrumb>
	`
})

