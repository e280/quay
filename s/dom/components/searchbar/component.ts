
import {html, shadowComponent, css} from '@benev/slate'
import themeCss from '../../theme.css.js'

import {findLocalGroup} from '../../utils/find-local-group.js'

const styleCss = css`
	sl-input::part(prefix) {
		padding-left: 0.5em;
	}
`

export const QuaySearchbar = shadowComponent(use => {
	use.styles(themeCss, styleCss)
	const group = findLocalGroup(use.element)

	return html`
		<sl-input
			size='small'
			pill
			placeholder='Search'
			clearable
			@sl-input=${(e: CustomEvent) => group.searchText.value = (e.target as HTMLInputElement).value}
		>
			<sl-icon name='search' slot='prefix'></sl-icon>
		</sl-input>
	`
})

