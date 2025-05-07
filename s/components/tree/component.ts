import {html, signal, shadowView, TemplateResult, css} from "@benev/slate"
import {context} from "../../context.js"
import {ItemType, TreeItem} from "../../types.js"

export const Tree = shadowView(use => () => {
	const tree = context.tree
	const items = signal<TreeItem[]>(tree.getAll())

	use.styles(context.theme, css`
		sl-tree-item::part(expand-button) {
			rotate: none;
		}
	`)

	use.mount(() => {
		const off = tree.subscribe(() => items.value = tree.getAll())
		return () => off()
	})

	const icon = (t: ItemType, open?: boolean) => ({
		folder: open ? 'folder2-open' : "folder",
		video: 'film',
		audio: 'music-note',
		image: 'image'
	}[t])

	const buildTree = (items: TreeItem[]) =>
		items
			.filter(i => i.parentId === null)
			.map(root => ({ ...root, children: collect(root.id, items) }))

	const collect = (pid: string, items: TreeItem[]): TreeItem[] =>
		items
			.filter(i => i.parentId === pid)
			.map(child => ({ ...child, children: collect(child.id, items) }))

	const render = (n: TreeItem): TemplateResult => html`
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
			${buildTree(items.value).map(render)}
		</sl-tree>`
})
