
import {Content} from "@e280/sly"
import {AsSchema} from "../../aspects/codex/parts/types.js"

export type PlainSchema = AsSchema<{
	taxon: {
		icon: Content
	}
	specimens: {
		item: {
			label: string
		}
	}
}>

