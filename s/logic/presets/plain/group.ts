
import {Group} from "../../group.js"
import {PlainSchema} from "./schema.js"
import {GroupConfig} from "../../types.js"
import {Codex} from "../../aspects/codex/codex.js"

export class PlainGroup extends Group<PlainSchema> {
	static config = (): GroupConfig<PlainSchema> => {
		const codex = Codex.setup<PlainSchema>({
			item: {icon: "📄"},
		})

		const root = codex.root(
			codex.create("item", {})
		)

		return {
			codex,
			root,
			defaultFilter: "all",
			filters: new Map()
				.set("all", () => true),
			search: (terms, item) => {
				return terms.some(term => (
					item.kind.includes(term) ||
					item.id.includes(term)
				))
			},
			renderLabel: item => item.id,
			renderIcon: item => item.taxon.icon,
			renderPreview: () => null,
		}
	}

	constructor() {
		super(PlainGroup.config())
	}
}

