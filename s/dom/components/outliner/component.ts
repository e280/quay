
import {html} from "lit"
import {shadowElement, useHost, useStyles} from "@e280/sly"

import themeCss from "../../theme.css.js"
import {Tree} from "../../views/tree/component.js"
import {findLocalGroup} from "../../utils/find-local-group.js"

export const QuayOutliner = shadowElement(() => {
	useStyles(themeCss)
	const host = useHost()
	const group = findLocalGroup(host)

	return html`
		<div class="panel">
			${Tree(group)}
		</div>`
})

