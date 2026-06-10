
import {html, css} from "lit"
import {shadowElement, useHost, useStyles} from "@e280/sly"

import themeCss from "../../theme.css.js"
import {findLocalGroup} from "../../utils/find-local-group.js"
import type SlMenuItem from "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js"

export const QuayFilter = shadowElement(() => {
	const host = useHost()
	const group = findLocalGroup(host)

	useStyles(themeCss, css`
		sl-menu {
			margin-top: 0.3em;

			.item {
				display: flex;
				align-items: center;
				gap: 0.5em;
			}
		}
	`)

	const onSelectFilter = (e: CustomEvent<{item: SlMenuItem}>) => {
		const value = e.detail.item.value
		group.selectedFilter(value)
	}

	return html`
		<div class="panel">
			<sl-dropdown>
				<sl-button size="small" slot="trigger" caret>
					<sl-icon name="funnel"></sl-icon>
				</sl-button>
			<sl-menu @sl-select=${onSelectFilter}>
				${[...group.config.filters?.keys()].map(filter => html`
					<sl-menu-item value=${filter}>
						<div class=item>
							<sl-icon name="check" slot="prefix" style="visibility: ${filter === group.selectedFilter() ? 'visible' : 'hidden'}"></sl-icon>
							<span>${filter}</span>
						</div>
					</sl-menu-item>
				`)}
			</sl-menu>
			</sl-dropdown>
		</div>`
})

