import {AsSchema, Taxon} from "./codex/parts/types.js"

export type ItemType = 'video' | 'image' | 'audio' | string

export type Specimen = {
	folder: {label: string}
	video: {label: string}
	image: {label: string}
	audio: {label: string}
}

export type MediaSchema = AsSchema<{
	taxon: Taxon
	specimens: Specimen
}>
