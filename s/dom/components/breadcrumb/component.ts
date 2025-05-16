import {html, shadowComponent} from '@benev/slate'
import {useQuayGroup} from '../../utils/use-quay-group.js'

export const QuayBreadcrumb = shadowComponent(use => {
	const {codex, trail} = useQuayGroup(use)

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
