import themeCss from "./theme.css.js"
import {Dropzone} from "../logic/dropzone.js"
import {TreeSearch} from "../logic/tree-search.js"
import {TreeManager} from "../logic/tree-manager.js"

class Quay {
	theme = themeCss
	readonly tree = new TreeManager()
	readonly search = new TreeSearch()
	readonly dropzone = new Dropzone()
}

export const context = new Quay()

const now = Date.now()
const id = (n: number) => `demo-${n}`

context.dropzone.onFilesDropped = async files => {
	for (const file of files) {
		context.tree.create({
			id: crypto.randomUUID(),
			name: file.name,
			type: file.type.split("/")[0],
			parentId: null,
			createdAt: Date.now(),
			sortIndex: 999
		})
	}
}

// demo
context.tree.create({
	id: id(0),
	name: 'Demo Folder',
	type: 'folder',
	parentId: null,
	createdAt: now,
	sortIndex: 0,
})

context.tree.create({
	id: id(1),
	name: 'Intro.mp4',
	type: 'video',
	parentId: id(0),
	createdAt: now + 1,
	sortIndex: 0
})

context.tree.create({
	id: id(2),
	name: 'Logo.png',
	type: 'image',
	parentId: id(0),
	createdAt: now + 2,
	sortIndex: 1
})

context.tree.create({
	id: id(3),
	name: 'Theme.mp3',
	type: 'audio',
	parentId: null,
	createdAt: now + 3,
	sortIndex: 1
})
