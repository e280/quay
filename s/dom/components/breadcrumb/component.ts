
import {html} from "lit"
import {shadowElement, useHost, useStyles} from "@e280/sly"

import themeCss from "../../theme.css.js"

import {findLocalGroup} from "../../utils/find-local-group.js"
import {CodexItem} from "../../../logic/aspects/codex/parts/codex-item.js"

export const QuayBreadcrumb = shadowElement(() => {
	useStyles(themeCss)

	const group = findLocalGroup(useHost())
	const {trail, config: {codex, renderLabel}} = group

	const click = (item: CodexItem) => (e: Event) => group.trail.setTrail(e, item)

	return html`
		<sl-breadcrumb>
			${trail.signal().map(item => html`
				<sl-breadcrumb-item @click="${click(item)}">
					${item === null
						? "root"
						: renderLabel(codex.require(item.id))}
				</sl-breadcrumb-item>
			`)}
		</sl-breadcrumb>
	`
})

