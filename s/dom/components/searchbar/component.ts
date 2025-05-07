import {html, shadowComponent} from '@benev/slate'
import {context} from '../../context.js'

export const QuaySearchbar = shadowComponent(use => {
	use.styles(context.theme)

	return html`
		<sl-input size='small' pill placeholder='Search' clearable>
			<sl-icon name='search' slot='prefix'></sl-icon>
		</sl-input>
	`
})
