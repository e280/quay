
import {html, css} from "lit"
import {shadowElement, useHost, useStyles} from "@e280/sly"

import themeCss from '../../theme.css.js'

import {findLocalGroup} from '../../utils/find-local-group.js'

const styleCss = css`
	sl-input::part(base) {
		border-radius: var(--radius);
	}

	sl-input::part(prefix) {
		padding-left: var(--space-sm);
	}
`

export const QuaySearchbar = shadowElement(() => {
	useStyles(themeCss, styleCss)
	const host = useHost()
	const group = findLocalGroup(host)

	return html`
		<sl-input
			size='small'
			pill
			placeholder='Search'
			clearable
			@sl-input=${(e: CustomEvent) => group.searchText((e.target as HTMLInputElement).value)}
		>
			<sl-icon name='search' slot='prefix'></sl-icon>
		</sl-input>
	`
})
