import {html, shadowView, TemplateResult, css} from "@benev/slate"
import {context} from "../../context.js"
import {ItemType, TreeItem, NestedTreeItem} from "../../../logic/types.js"

export const Tree = shadowView(use => () => {
	const {tree, search} = context

	use.styles(context.theme, css`
		sl-tree-item::part(expand-button) {
			rotate: none;
		}
	`)

	const icon = (t: ItemType, open?: boolean) => ({
		folder: open ? 'folder2-open' : "folder",
		video: 'film',
		audio: 'music-note',
		image: 'image'
	}[t])

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

		const isLeaf = node.type !== 'folder'
		const matchesLeaf = isLeaf && search.matches(node.name)
		const hasMatchingDescendants = children.length > 0

		if (!matchesLeaf && !hasMatchingDescendants)
			return null

		return {...node, children}
	}

	const render = (n: NestedTreeItem): TemplateResult => html`
		<sl-tree-item>
			${n.type === 'folder'
				? html`
					<sl-icon slot='expand-icon'   name='${icon('folder')}'></sl-icon>
					<sl-icon slot='collapse-icon' name='${icon('folder', true)}'></sl-icon>
				`
				: html`<sl-icon name='${icon(n.type)}'></sl-icon>`}
			${n.name}
			${n.children?.map(render)}
		</sl-tree-item>
	`

	return html`
		<sl-tree>
			${buildNestedTree(tree.items).map(render)}
		</sl-tree>`
})
