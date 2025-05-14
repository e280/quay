import {AsSchema, Taxon} from "./codex/parts/types.js"

export type ItemType = 'video' | 'image' | 'audio' | string

export type Specimen = {
	folder: Item
	video: MediaItem
	image: MediaItem
	audio: Item
}

export interface Item {
	label: string
}

export interface MediaItem extends Item {
	previewUrl: string
}

export type MediaSchema = AsSchema<{
	taxon: Taxon
	specimens: Specimen
}>
