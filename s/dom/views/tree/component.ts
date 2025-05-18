
import {html, shadowView, TemplateResult} from "@benev/slate"

import styleCss from "./style.css.js"
import themeCss from "../../theme.css.js"

import {Group} from "../../../logic/group.js"
import {CodexItem} from "../../../logic/aspects/codex/parts/codex-item.js"

export const Tree = shadowView(use => (group: Group) => {
	use.styles(themeCss, styleCss)

	const {config} = group
	const {dropzone, trail, config: {root}} = group

	use.mount(() => {
		const dispose = dropzone.onChange.sub(() => use.rerender())
		return () => dispose()
	})

	const renderFolderItem = (item: CodexItem) => html`
		<input
			@dragenter=${(e: DragEvent) => dropzone.dragenter(e, item)}
			@dragleave=${dropzone.dragleave}
			@dragover=${(e: DragEvent) => dropzone.dragover(e, item)}
			@drop=${(e: DragEvent) => dropzone.drop(e, item)}
			@click=${(e: Event) => e.preventDefault()}
			id="file-import"
			class="file-import folder-hover"
		>
		<span class="folder" slot="expand-icon">${config.renderIcon(item, false)}</span>
		<span class="folder" slot="collapse-icon">${config.renderIcon(item, true)}</span>
		${config.renderLabel(item)}
	`

	const renderItem = (item: CodexItem) => html`
		${config.renderIcon(item, false)}
		${config.renderLabel(item)}
	`

	const render = (item: CodexItem): TemplateResult => {
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
				${group.sort(item.children).map((item) => group.matches(item) ? render(item) : null)}
			</sl-tree-item>
		`
	}

	return html`
		<sl-tree selection=leaf>
			${render(root)}
		</sl-tree>`
})

