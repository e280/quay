import {html, shadowView, TemplateResult, css} from "@benev/slate"
import {context} from "../../context.js"
import {TreeItem, NestedTreeItem} from "../../../logic/types.js"

export const Tree = shadowView(use => () => {
	const {tree, search, schema} = context

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

		const isLeaf = !node.allowChildren
		const matchesLeaf = isLeaf && search.matches(node.name)
		const hasMatchingDescendants = children.length > 0

		if (!matchesLeaf && !hasMatchingDescendants)
			return null

		return {...node, children}
	}

	const render = (n: NestedTreeItem): TemplateResult => html`
		<sl-tree-item data-type=${n.meta?.type}>
			${n.allowChildren
				? html`
					<sl-icon slot='expand-icon'   name='${schema.getIcon(n)}'></sl-icon>
					<sl-icon slot='collapse-icon' name='${schema.getIcon(n, true)}'></sl-icon>
				`
				: html`<sl-icon class='item' name='${schema.getIcon(n)}'></sl-icon>`}
			${n.name}
			${n.children?.map(render)}
		</sl-tree-item>
	`

	return html`
		<sl-tree selection=leaf>
			${buildNestedTree(tree.items).map(render)}
		</sl-tree>`
})
