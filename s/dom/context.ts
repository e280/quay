import {Codex} from "../logic/codex/codex.js"
import {QuayBrain} from "../logic/quay-brain.js"
import {Kind} from "../logic/codex/parts/types.js"
import {CodexItem} from "../logic/codex/parts/codex-item.js"
import {MediaSchema, SearchFn, Specimen} from "../logic/types.js"

const mediaCodex = Codex.setup<MediaSchema>({
	folder: {icon: "folder"},
	video: {icon: "film"},
	image: {icon: "image"},
	audio: {icon: "music-note"},
})

const filters = new Map<string, SearchFn<MediaSchema>>()
	.set("all", () => true)
	.set("video", item => item.kind === "video")
	.set("audio", item => item.kind === "audio")

const search = (terms: string[], item: CodexItem<MediaSchema>) =>
	terms.some(term => item.specimen.label.toLowerCase().includes(term))

export const context = new QuayBrain<MediaSchema>({
	codex: mediaCodex,
	filters,
	search,
	defaultFilter: "all",
	root: mediaCodex.create("folder", {label: "project"})
})


const previewUrl = "/assets/preview.webp"
const introVid = context.codex.create("video", {label: "01‑introduction.mp4", previewUrl})
const coverImg = context.codex.create("image", {label: "cover.png", previewUrl})
const audioFx = context.codex.create("audio", {label: "click.wav"})

// sub folder
const sprites = context.codex.create("folder", {label: "sprites"})
const heroPng = context.codex.create("image", {label: "hero.png", previewUrl})
const enemyPng = context.codex.create("image", {label: "enemy.png", previewUrl})

context.codex.root(context.root)
	.attach(introVid)
	.attach(coverImg)
	.attach(audioFx)
	.attach(sprites)

sprites.attach(heroPng).attach(enemyPng)

context.dropzone.onImport.sub((files, folder) => {
	for(const file of files) {
		const type = file.type.split("/")[0] as Kind<MediaSchema>
		const item = context.codex.create(type, {label: file.name})
		folder?.attach(item)
	}
})

context.dropzone.onDrop.sub((grabbedItem, targetFolder) => {
	grabbedItem.detach()
	targetFolder?.attach(grabbedItem)
})
