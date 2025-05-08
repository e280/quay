import {html, shadowComponent, css} from '@benev/slate'
import {context} from '../../context.js'

export const QuaySearchbar = shadowComponent(use => {
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
			value=${context.search.query.value}
			@sl-input=${(e: CustomEvent) => {
				context.search.query.value = (e.target as HTMLInputElement).value
			}}
		>
			<sl-icon name='search' slot='prefix'></sl-icon>
		</sl-input>
	`
})
