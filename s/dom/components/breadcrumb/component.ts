import {html, shadowComponent} from '@benev/slate'
import {context} from '../../context.js'

export const QuayBreadcrumb = shadowComponent(use => {
	const {codex, trail} = context

	return html`
		<sl-breadcrumb>
			${trail.trail.value.map(item => html`
				<sl-breadcrumb-item
					@click=${(e: Event) => trail.setTrail(e, item)}
				>
					${item === null ? 'root' : codex.require(item.id).specimen.label}
				</sl-breadcrumb-item>
			`)}
		</sl-breadcrumb>
	`
})
