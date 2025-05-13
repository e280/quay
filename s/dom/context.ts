import themeCss from "./theme.css.js"
import {Codex} from "../logic/codex/codex.js"
import {Dropzone} from "../logic/dropzone.js"
import {TreeTrail} from "../logic/tree-trail.js"
import {TreeSearch} from "../logic/tree-search.js"
import {Kind} from "../logic/codex/parts/types.js"
import {MediaSchema, Specimen} from "../logic/types.js"

class Quay {
	theme = themeCss
	mediaCodex = Codex.setup<MediaSchema>({
		folder: {icon: "folder"},
		video: {icon: "film"},
		image: {icon: "image"},
		audio: {icon: "music-note"},
	})
	root = this.mediaCodex.create("folder", {label: "project"})
	search = new TreeSearch()
	dropzone = new Dropzone()
	trail = new TreeTrail(this.root)
}

export const context = new Quay()

const introVid = context.mediaCodex.create("video", {label: "01‑introduction.mp4",})
const coverImg = context.mediaCodex.create("image", {label: "cover.png"})
const audioFx = context.mediaCodex.create("audio", {label: "click.wav"})

// sub folder
const sprites = context.mediaCodex.create("folder", {label: "sprites"})
const heroPng = context.mediaCodex.create("image", {label: "hero.png"})
const enemyPng = context.mediaCodex.create("image", {label: "enemy.png"})

context.mediaCodex.root(context.root)
	.attach(introVid)
	.attach(coverImg)
	.attach(audioFx)
	.attach(sprites)

sprites.attach(heroPng).attach(enemyPng)

context.dropzone.onImport.sub((files, folder) => {
	for(const file of files) {
		const type = file.type.split("/")[0] as Kind<MediaSchema>
		const item = context.mediaCodex.create(type, {label: file.name})
		folder?.attach(item)
	}
})

context.dropzone.onDrop.sub((grabbedItem, targetFolder) => {
	grabbedItem.detach()
	targetFolder?.attach(grabbedItem)
})
