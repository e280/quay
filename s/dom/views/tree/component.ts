import {html, shadowView, TemplateResult, css} from "@benev/slate"
import {context} from "../../context.js"
import {MediaSchema} from "../../../logic/types.js"
import {CodexItem} from "../../../logic/codex/parts/codex-item.js"

export const Tree = shadowView(use => () => {
	const {dropzone, root, trail} = context

	use.styles(context.theme, css`
		sl-tree-item::part(expand-button) {
			rotate: none;
		}

		sl-icon:is(.item) {
			padding: 0.5em;
		}

		sl-tree-item:not([data-type=folder])::part(expand-button) {
			display: none;
		}

		.file-import {
			position: absolute;
			opacity: 0;
			left: 0;
			width: 100%;
		}

		.folder-hover {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			bottom: 0;
		}

		sl-tree-item[data-hover] {
			border-radius: 5px;
			border: 1px solid var(--sl-color-primary-600);
		}
	`)

	use.mount(() => {
		const dispose = dropzone.onChange.sub(() => use.rerender())
		return () => dispose()
	})

	const renderFolderItem = (item: CodexItem<MediaSchema>) => html`
		<input
			@dragenter=${dropzone.dragenter}
			@dragleave=${dropzone.dragleave}
			@dragover=${(e: DragEvent) => dropzone.dragover(e, item)}
			@drop=${(e: DragEvent) => dropzone.drop(e, item)}
			@click=${(e: Event) => e.preventDefault()}
			@change=${(e: Event) => console.log(e)}
			id="file-import"
			class="file-import folder-hover"
		>
		<sl-icon slot='expand-icon'   name='${item.taxon.icon}'></sl-icon>
		<sl-icon slot='collapse-icon' name='${item.taxon.icon}'></sl-icon>
		${item.specimen.label}
	`

	const renderItem = (n: CodexItem<MediaSchema>) => html`
		<sl-icon class='item' name='${n.taxon.icon}'></sl-icon>
		${n.specimen.label}
	`
	const render = (item: CodexItem<MediaSchema>): TemplateResult => {
		return html`
			<sl-tree-item
				draggable="true"
				@dragstart=${(e: DragEvent) => dropzone.dragstart(e, item)}
				@dragend=${dropzone.dragend}
				@click=${(e: Event) => trail.setTrail(e, item)}
				data-type=${item.kind}
				?data-hover=${dropzone.hovering?.id === item.id}
			>
				${item.kind === "folder"
					? renderFolderItem(item)
					: renderItem(item)}
				${item.children.map(render)}
			</sl-tree-item>
		`
	}

	return html`
		<sl-tree selection=leaf>
			${render(root)}
		</sl-tree>`
})
