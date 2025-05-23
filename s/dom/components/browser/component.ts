import {html, shadowComponent} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"

import {findLocalGroup} from "../../utils/find-local-group.js"
import {CodexItem} from "../../../logic/aspects/codex/parts/codex-item.js"

export const QuayBrowser = shadowComponent(use => {
	use.styles(themeCss, styleCss)

	const group = findLocalGroup(use.element)
	const {trail, config} = group
	const [viewMode, setViewMode] = use.state<'details' | 'tiles'>('tiles')

	use.mount(() => {
		const dispose = group.on.upload.sub(() => use.rerender())
		return () => dispose()
	})

	const getItems = () => {
		return group.sort(trail.currentFolder).filter(item => group.matches(item)) as CodexItem[]
	}

	const renderTiles = () => html`
		<div class="tiles">
			${getItems().map(item => html`
				<div class="item" @click="${(e: Event) => trail.setTrail(e, item)}">
					<div class="media-icon">
						${config.renderPreview(item) ?? config.renderIcon(item, false)}
					</div>
					<div class="label" title="${config.renderLabel(item)}">
						${config.renderLabel(item)}
					</div>
				</div>
			`)}
		</div>
	`

	const renderDetails = () => html`
		<div class="details">
			${getItems().map(item => html`
				<div @click=${(e: Event) => trail.setTrail(e, item)} class="card">
					${config.renderIcon(item, false)}
					<div class=meta>
						<div class=name>${config.renderLabel(item)}</div>
						<div class=type>${item.kind}</div>
					</div>
				</div>
			`)}
		</div>
	`
	// // TODO icons
	// <sl-icon name=${item.taxon.icon}></sl-icon>

	return html`
		<div class="toolbar">
			<sl-button-group label="View mode">
				<sl-tooltip content="Tiles">
					<sl-button size="small" outline data-active=${viewMode === 'tiles'} @click=${() => setViewMode('tiles')}>
						<sl-icon name="grid-3x3-gap"></sl-icon>
					</sl-button>
				</sl-tooltip>
				<sl-tooltip content="Details">
					<sl-button size="small" outline data-active=${viewMode === 'details'} @click=${() => setViewMode('details')}>
						<sl-icon name="list"></sl-icon>
					</sl-button>
				</sl-tooltip>
			</sl-button-group>
		</div>

		${viewMode === 'details' ? renderDetails() : renderTiles()}
	`
})

