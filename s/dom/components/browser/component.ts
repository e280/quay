import {html, shadowComponent} from "@benev/slate"
import styles from "./styles.js"
import {useQuayGroup} from "../../utils/use-quay-group.js"
import {MediaItem, MediaSchema} from "../../../logic/types.js"
import {CodexItem} from "../../../logic/codex/parts/codex-item.js"

export const QuayBrowser = shadowComponent(use => {
	const context = useQuayGroup(use)
	const {trail, theme} = context
	const [viewMode, setViewMode] = use.state<'details' | 'tiles'>('tiles')

	const getItems = () => {
		return trail.currentFolder.filter(item => context.matches(item))
	}

	use.styles(theme, styles)

	const preview = (item: CodexItem<MediaSchema>) => {
		if(item.kind === "image" || item.kind === "video") {
			const spec = item.specimen as MediaItem
			return html`<img src=${spec.previewUrl}>`
		} else return html`<sl-icon name=${item.taxon.icon}></sl-icon>`
	}

	const renderTiles = () => html`
		<div class="tiles">
			${getItems().map(item => html`
				<div @click=${(e: Event) => trail.setTrail(e, item)} class="item">
					<div class="media-icon">
						${preview(item)}
					</div>
					<div class="label" title=${item.specimen.label}>${item.specimen.label}</div>
				</div>
			`)}
		</div>
	`

	const renderDetails = () => html`
		<div class="details">
			${getItems().map(item => html`
				<div @click=${(e: Event) => trail.setTrail(e, item)} class="card">
					<sl-icon name=${item.taxon.icon}></sl-icon>
					<div class=meta>
						<div class=name>${item.specimen.label}</div>
						<div class=type>${item.kind}</div>
					</div>
				</div>
			`)}
		</div>
	`

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
