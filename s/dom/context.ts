import themeCss from "./theme.css.js"
import {Dropzone} from "../logic/dropzone.js"
import {TreeSearch} from "../logic/tree-search.js"
import {TreeManager} from "../logic/tree-manager.js"
import {TreeNavigator} from "../logic/tree-navigator.js"
import {NestedTreeItem, QuaySchema, TreeItem} from "../logic/types.js"

class Quay {
	theme = themeCss
	readonly tree = new TreeManager()
	readonly search = new TreeSearch()
	readonly dropzone = new Dropzone()
	readonly navigator = new TreeNavigator()
	readonly schema: QuaySchema<TreeItem | NestedTreeItem> = {
		getLabel: item => item.name,
		getIcon: (item, open?: boolean) =>
			item.allowChildren
				? 'folder' : open ? 'folder-2open'
				: ({
						video: 'film',
						audio: 'music-note',
						image: 'image',
						unknown: 'question'
				}[item.meta?.type ?? "unknown"] ?? 'file'),
		isFolder: item => item.allowChildren === true
	}
}

export const context = new Quay()

const now = Date.now()
const id = (n: number) => `demo-${n}`

context.dropzone.onImport = ((files, folder) => {
	for (const file of files) {
		const children = context.tree.items.filter(item => item.parentId === folder?.id)
		const rootItems = context.tree.items.filter(i => !i.parentId)
		context.tree.create({
			id: crypto.randomUUID(),
			name: file.name,
			parentId: folder?.id,
			createdAt: Date.now(),
			sortIndex: folder ? children[children.length - 1].sortIndex + 1 : rootItems[rootItems.length - 1].sortIndex + 1,
			allowChildren: false,
			meta: {
				type: file.type.split("/")[0]
			}
		})
	}
})

context.dropzone.onDrop = async (draggedItem, dropTarget) => {
	const item = context.tree.getItem(draggedItem.id)
	item!.parentId = dropTarget?.id
}

// demo
context.tree.create({
	id: id(0),
	name: 'Demo Folder',
	allowChildren: true,
	parentId: null,
	createdAt: now,
	sortIndex: 0,
	meta: {
		type: "folder"
	}
})

context.tree.create({
	id: id(6),
	name: 'Folder demo',
	allowChildren: true,
	parentId: id(0),
	createdAt: now,
	sortIndex: 2,
	meta: {
		type: "folder"
	}
})

context.tree.create({
	id: id(7),
	name: 'Intro.mp4',
	allowChildren: false,
	parentId: id(6),
	createdAt: now + 1,
	sortIndex: 0,
	meta: {
		type: "video"
	}
})

context.tree.create({
	id: id(1),
	name: 'Intro.mp4',
	allowChildren: false,
	parentId: id(0),
	createdAt: now + 1,
	sortIndex: 0,
	meta: {
		type: "video"
	}
})

context.tree.create({
	id: id(2),
	name: 'Logo.png',
	allowChildren: false,
	parentId: id(0),
	createdAt: now + 2,
	sortIndex: 1,
	meta: {
		type: "image"
	}
})

context.tree.create({
	id: id(3),
	name: 'Theme.mp3',
	allowChildren: false,
	parentId: null,
	createdAt: now + 3,
	sortIndex: 1,
	meta: {
		type: "audio"
	}
})
