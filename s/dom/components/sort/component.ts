import {html, shadowComponent, css} from "@benev/slate"
import themeCss from "../../theme.css.js"
import {findLocalGroup} from "../../utils/find-local-group.js"
import type SlMenuItem from "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js"

export const QuaySort = shadowComponent(use => {
	const group = findLocalGroup(use.element)

	use.styles(themeCss, css`
		sl-button sl-icon {
			font-size: 14px;
		}

		sl-menu {
			margin-top: 0.3em;

			.item {
				display: flex;
				align-items: center;
				gap: 0.5em;
			}
		}
	`)

	const onSelectSort = (e: CustomEvent<{item: SlMenuItem}>) => {
		const value = e.detail.item.value
		group.selectedSort.value = value
	}

	return html`
		<div class="panel">
			<sl-dropdown>
				<sl-button size="small" slot="trigger" caret>
					<sl-icon name="sort-down-alt"></sl-icon>
				</sl-button>
			<sl-menu @sl-select=${onSelectSort}>
				${[...group.config.sorts?.keys()].map(sort => html`
					<sl-menu-item value=${sort}>
						<div class=item>
							<sl-icon name="check" slot="prefix" style="visibility: ${sort === group.selectedSort.value ? 'visible' : 'hidden'}"></sl-icon>
							<span>${sort}</span>
						</div>
					</sl-menu-item>
				`)}
			</sl-menu>
			</sl-dropdown>
		</div>`
})
