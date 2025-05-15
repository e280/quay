import {html, shadowComponent} from "@benev/slate"
import {context} from "../../context.js"

export const QuayFilter = shadowComponent(use => {
	const {codex, filters} = context
	use.styles(context.theme)

	const attrs = use.attrs({allowFilters: String, selectedFilter: String})
	use.styles(context.theme)

	const all = [...filters.keys()]
	const allowed = (attrs.allowFilters?.split(',').map(x => x.trim()) ?? all)
		.filter(key => filters.has(key))

	const selected = allowed.includes(attrs.selectedFilter ?? "")
		? attrs.selectedFilter
		: context.defaultFilter

	return html`
		<div class="panel">
			<sl-dropdown>
				<sl-button size="small" slot="trigger" caret>
					<sl-icon name="funnel"></sl-icon>
				</sl-button>
				<sl-menu>
					${allowed.map((filter => html`
						<sl-menu-item type="checkbox" value=${filter}>${filter}</sl-menu-item>
					`))}
				</sl-menu>
			</sl-dropdown>
		</div>`
})
