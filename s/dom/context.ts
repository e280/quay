import themeCss from "./theme.css.js"
import {TreeManager} from "../logic/tree-manager.js"

class Quay {
	theme = themeCss
	readonly tree = new TreeManager()
}

export const context = new Quay()

const now = Date.now()
const id = (n: number) => `demo-${n}`

// demo
context.tree.create({
	id: id(0),
	name: 'Demo Folder',
	type: 'folder',
	parentId: null,
	createdAt: now,
	sortIndex: 0,
	children: []
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
