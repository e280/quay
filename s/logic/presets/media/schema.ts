
import {Content} from "@e280/sly"
import {AsSchema} from "../../aspects/codex/parts/types.js"
import {CodexItem} from "../../aspects/codex/parts/codex-item.js"

export type MediaFormat = "video" | "image" | "audio" | "other"

export type MediaSchema = AsSchema<{
	taxon: {
		icon: Content
	}
	specimens: {
		folder: {
			label: string
		}
		file: {
			label: string
			format: MediaFormat
			previewUrl: string | null
			hash?: string
			mime?: string
			size?: number
		}
	}
}>

export type MediaProgress = {
	item: CodexItem<MediaSchema>
	loaded: number
	total: number
}
