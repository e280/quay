
import {register} from "@benev/slate"
import {brain} from "../dom/context.js"
import {Kind} from "../logic/aspects/codex/parts/types.js"
import {MediaGroup} from "../logic/presets/media/group.js"
import {MediaSchema} from "../logic/presets/media/schema.js"
import {components, setShoelaceDarkTheme} from "../dom/components.js"

const group = brain.setGroup("default", new MediaGroup())
const {codex, root} = group.config

const previewUrl = "/assets/preview.webp"
const introVid = codex.create("file", {format: "video", label: "01‑introduction.mp4", previewUrl})
const coverImg = codex.create("file", {format: "image", label: "cover.png", previewUrl})
const audioFx = codex.create("file", {format: "audio", label: "click.wav", previewUrl: null})

// sub folder
const sprites = codex.create("folder", {label: "sprites"})
const heroPng = codex.create("file", {format: "image", label: "hero.png", previewUrl})
const enemyPng = codex.create("file", {format: "image", label: "enemy.png", previewUrl})

codex.root(root)
	.attach(introVid)
	.attach(coverImg)
	.attach(audioFx)
	.attach(sprites)

sprites.attach(heroPng).attach(enemyPng)

group.dropzone.onImport.sub((files, folder) => {
	for(const file of files) {
		const type = file.type.split("/")[0] as Kind<MediaSchema>
		const item = codex.create(type, {label: file.name})
		folder?.attach(item)
	}
})

group.dropzone.onDrop.sub((grabbedItem, targetFolder) => {
	grabbedItem.detach()
	targetFolder?.attach(grabbedItem)
})

setShoelaceDarkTheme()
register(components)

