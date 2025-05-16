import {html, shadowComponent, css} from '@benev/slate'
import {useQuayGroup} from '../../utils/use-quay-group.js'

export const QuaySearchbar = shadowComponent(use => {
	const context = useQuayGroup(use)

	use.styles(context.theme, css`
		sl-input::part(prefix) {
			padding-left: 0.5em;
		}
	`)

	return html`
		<sl-input
			size='small'
			pill
			placeholder='Search'
			clearable
			@sl-input=${(e: CustomEvent) => context.searchText.value = (e.target as HTMLInputElement).value}
		>
			<sl-icon name='search' slot='prefix'></sl-icon>
		</sl-input>
	`
})
