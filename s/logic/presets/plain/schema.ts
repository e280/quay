
import {Content} from "@benev/slate"
import {AsSchema} from "../../aspects/codex/parts/types.js"

export type PlainSchema = AsSchema<{
	taxon: {
		icon: Content
	}
	specimens: {
		item: {}
	}
}>

