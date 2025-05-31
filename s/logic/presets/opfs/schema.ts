
import {Content} from "@benev/slate"
import {AsSchema} from "../../aspects/codex/parts/types.js"

export type OpfsSchema = AsSchema<{
	taxon: {
		icon: Content
	}
	specimens: {
		directory: {
			label: string
		}
		file: {
			label: string
			size: string
			type: string
			lastModified: number
		}
	}
}>

