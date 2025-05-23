
import {register} from "@benev/slate"
import {brain} from "../dom/context.js"
import {MediaGroup} from "../logic/presets/media/group.js"
import {MediaFormat} from "../logic/presets/media/schema.js"
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

group.on.upload.sub(({files, target}) => {
	for(const file of files) {
		const format = file.type.split("/")[0] as MediaFormat
		const item = codex.create("file", {label: file.name, format, previewUrl})
		target.attach(item)
	}
})

setShoelaceDarkTheme()
register(components)

