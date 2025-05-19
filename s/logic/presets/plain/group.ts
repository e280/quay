
import Quay from "../../../index.js"
import {Group} from "../../group.js"
import {PlainSchema} from "./schema.js"
import {GroupConfig, SortFn} from "../../types.js"
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
			defaultSort: "id",
			sorts: new Map<string, SortFn<PlainSchema>>()
				.set("label", (a, b) => a.id.localeCompare(b.id)),
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
			permissions: async item => Quay.permissions.all,
			actions: {
				newFolder: async parent => {},
				move: async (item, target) => {},
				delete: async item => {},
				rename: async (item, newName) => {},
				upload: async (files, target) => {},
				search: async terms => {
					return []
				},
				refresh: async () => {},
			}
		}
	}

	constructor() {
		super(PlainGroup.config())
	}
}

