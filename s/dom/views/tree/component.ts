import {html, shadowView, TemplateResult, css} from "@benev/slate"
import {context} from "../../context.js"
import {TreeItem, NestedTreeItem} from "../../../logic/types.js"

export const Tree = shadowView(use => () => {
	const {tree, search, schema, navigator, dropzone} = context

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

		.folder-hover, .item-hover {
			position: absolute;
			width: 100%;
			height: 30px;
			left: 0;

		}

		.item-hover[data-hover] {
			border-bottom: 1px solid var(--sl-color-primary-600);
		}

		.folder-hover[data-hover] {
			border-radius: 5px;
			border: 1px solid var(--sl-color-primary-600);
		}
	`)

	// build nested tree from flat tree
	const buildNestedTree = (items: TreeItem[]): NestedTreeItem[] =>
		items
			.filter(i => i.parentId === null)
			.map(root => collectDeep(root, items))
			.filter(n => n !== null)

	const collectDeep = (node: TreeItem, items: TreeItem[]): NestedTreeItem | null => {
		const children = items
			.filter(i => i.parentId === node.id)
			.map(child => collectDeep(child, items))
			.filter(c => c !== null)

		// const isLeaf = !node.allowChildren
		const matchesLeaf = search.matches(node.name)
		const hasMatchingDescendants = children.length > 0

		if (!matchesLeaf && !hasMatchingDescendants)
			return null

		return {...node, children}
	}

	const enterFolder = (e: Event, n: NestedTreeItem, path: (string | null)[]) => {
		if(n.allowChildren && e.target === e.currentTarget) {
			navigator.enter(path)
		}
	}

	const dz = (n: NestedTreeItem) => html`
		<div ?data-hover=${dropzone.dropTarget.value === n.id} class=${n.allowChildren ? "folder-hover" : "item-hover"}></div>
		<input
			@click=${(e: Event) => e.preventDefault()}
			@dragenter=${(e: DragEvent) => dropzone.dragenter(e, n.id)}
			@dragleave=${dropzone.dragleave}
			@dragover=${dropzone.dragover}
			@drop=${dropzone.drop}
			id="file-import"
			class="file-import"
		>
	`

	const renderFolderItem = (n: NestedTreeItem) => html`
		${dz(n)}
		<sl-icon slot='expand-icon'   name='${schema.getIcon(n)}'></sl-icon>
		<sl-icon slot='collapse-icon' name='${schema.getIcon(n, true)}'></sl-icon>
		${n.name}
	`

	const renderItem = (n: NestedTreeItem) => html`
		${dz(n)}
		<sl-icon class='item' name='${schema.getIcon(n)}'></sl-icon>
		${n.name}
	`

	const render = (n: NestedTreeItem, path: (string|null)[]): TemplateResult => {
		const newPath = [...path, n.id]
		return html`
			<sl-tree-item
				@click=${(e: Event) => enterFolder(e, n, newPath)}
				data-type=${n.meta?.type}
			>
				${n.allowChildren
					? renderFolderItem(n)
					: renderItem(n)}
				${n.children?.map(child => render(child, newPath))}
			</sl-tree-item>
		`
	}

	return html`
		<sl-tree selection=leaf>
			${buildNestedTree(tree.items).map(root => render(root, [null]))}
		</sl-tree>`
})
