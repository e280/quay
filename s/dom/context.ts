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

const search: (terms: string[], item: CodexItem<MediaSchema>) => boolean =
(terms, item) => {
	const query = terms.join(" ").trim().toLowerCase()
	if (query === "") return true

	if (item.kind === "folder") {
		return item.children.some(child => search(terms, child))
	}

	return item.specimen.label.toLowerCase().includes(query)
}

export const context = new QuayBrain<MediaSchema>()

const group = context.createGroup("media", {
	codex: mediaCodex,
	filters,
	search,
	defaultFilter: "all",
	root: mediaCodex.create("folder", {label: "project"})
})


const previewUrl = "/assets/preview.webp"
const introVid = group.codex.create("video", {label: "01‑introduction.mp4", previewUrl})
const coverImg = group.codex.create("image", {label: "cover.png", previewUrl})
const audioFx = group.codex.create("audio", {label: "click.wav"})

// sub folder
const sprites = group.codex.create("folder", {label: "sprites"})
const heroPng = group.codex.create("image", {label: "hero.png", previewUrl})
const enemyPng = group.codex.create("image", {label: "enemy.png", previewUrl})

group.codex.root(group.root)
	.attach(introVid)
	.attach(coverImg)
	.attach(audioFx)
	.attach(sprites)

sprites.attach(heroPng).attach(enemyPng)

group.dropzone.onImport.sub((files, folder) => {
	for(const file of files) {
		const type = file.type.split("/")[0] as Kind<MediaSchema>
		const item = group.codex.create(type, {label: file.name})
		folder?.attach(item)
	}
})

group.dropzone.onDrop.sub((grabbedItem, targetFolder) => {
	grabbedItem.detach()
	targetFolder?.attach(grabbedItem)
})
