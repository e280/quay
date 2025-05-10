import {html, shadowComponent} from '@benev/slate'
import {context} from '../../context.js'

export const QuayBreadcrumb = shadowComponent(use => {
	const {tree, schema, navigator} = context

	return html`
		<sl-breadcrumb>
			${navigator.path.value.map((id, idx) => html`
				<sl-breadcrumb-item
					@click=${() => {
						const newPath = navigator.path.value.slice(0, idx + 1)
						navigator.enter(newPath)
					}}
				>
					${id === null ? 'root' : schema.getLabel(tree.getItem(id)!)}
				</sl-breadcrumb-item>
			`)}
		</sl-breadcrumb>
	`
})
