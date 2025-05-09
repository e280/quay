import {html, shadowComponent} from "@benev/slate"
import styles from "./styles.js"
import {context} from "../../context.js"
import {TreeItem} from "../../../logic/types.js"

export const QuayBrowser = shadowComponent(use => {
	const {tree, search, theme} = context
	const [viewMode, setViewMode] = use.state<'list' | 'details' | 'tiles' | 'content'>('tiles')

	const getItems = () =>
		tree.items.filter(item =>
			item.type !== 'folder' && search.matches(item.name)
		)

	use.styles(theme, styles)

	const iconFor = (type: TreeItem['type']) => ({
		video: 'film',
		image: 'image',
		audio: 'music-note'
	}[type])

	const renderTiles = () => html`
		<div class="tiles">
			${getItems().map(item => html`
				<div class="item">
					<div class="media-icon">
						<sl-icon name=${iconFor(item.type)}></sl-icon>
					</div>
					<div class="label" title=${item.name}>${item.name}</div>
				</div>
			`)}
		</div>
	`

	const renderList = () => html`
		<div class="list">
			${getItems().map(item => html`
				<div class="item">
					<div class="media-icon">
						<sl-icon name=${iconFor(item.type)}></sl-icon>
					</div>
					<span>${item.name}</span>
				</div>
			`)}
		</div>
	`

	const renderDetails = () => html`
		<div class="details">
			${getItems().map(item => html`
				<div class="row">
					<sl-icon name=${iconFor(item.type)}></sl-icon>
					<span>${item.name}</span>
					<span class=type>${item.type}</span>
				</div>
			`)}
		</div>
	`

	const renderContent = () => html`
		<div class="content">
			${getItems().map(item => html`
				<div class="card">
					<sl-icon name=${iconFor(item.type)}></sl-icon>
					<div class=meta>
						<div class=name>${item.name}</div>
						<div class=type>${item.type}</div>
					</div>
				</div>
			`)}
		</div>
	`

	return html`
		<div class="toolbar">
			<sl-button-group label="View mode">
				<sl-tooltip content="List">
					<sl-button variant="default" size="small" outline data-active=${viewMode === 'list'} @click=${() => setViewMode('list')}>
						<sl-icon name="list-ul"></sl-icon>
					</sl-button>
				</sl-tooltip>
				<sl-tooltip content="Details">
					<sl-button size="small" outline data-active=${viewMode === 'details'} @click=${() => setViewMode('details')}>
						<sl-icon name="list"></sl-icon>
					</sl-button>
				</sl-tooltip>
				<sl-tooltip content="Tiles">
					<sl-button size="small" outline data-active=${viewMode === 'tiles'} @click=${() => setViewMode('tiles')}>
						<sl-icon name="grid-3x3-gap"></sl-icon>
					</sl-button>
				</sl-tooltip>
				<sl-tooltip content="Content">
					<sl-button size="small" outline data-active=${viewMode === 'content'} @click=${() => setViewMode('content')}>
						<sl-icon name="layout-text-window"></sl-icon>
					</sl-button>
				</sl-tooltip>
			</sl-button-group>
		</div>

		${
			viewMode === 'list' ? renderList()
			: viewMode === 'details' ? renderDetails()
			: viewMode === 'content' ? renderContent()
			: renderTiles()
		}
	`
})
