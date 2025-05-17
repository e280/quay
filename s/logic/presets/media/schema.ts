
import {Content} from "@benev/slate"
import {AsSchema} from "../../aspects/codex/parts/types.js"

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
		}
	}
}>

