
import {MapG} from "@e280/stz"
import {Content, html} from "@benev/slate"

import {Group} from "../../group.js"
import {Codex} from "../../aspects/codex/codex.js"
import {MediaFormat, MediaSchema} from "./schema.js"
import {GroupConfig, SearchFn, SortFn} from "../../types.js"
import {CodexItem} from "../../aspects/codex/parts/codex-item.js"

export class MediaGroup extends Group<MediaSchema> {
	static config = (): GroupConfig<MediaSchema> => {
		const formatIcons = new MapG<MediaFormat, Content>()
			.set("audio", "🎵")
			.set("video", "📼")
			.set("image", "🖼️")
			.set("other", "📄")

		const filters = new Map<string, SearchFn<MediaSchema>>()
			.set("all", () => true)
			.set("video", item => item.isKind("folder") || (item.isKind("file") && item.specimen.format === "video"))
			.set("audio", item => item.isKind("folder") || (item.isKind("file") && item.specimen.format === "audio"))

		const sorts = new Map<string, SortFn<MediaSchema>>()
			.set("label", (a, b) => a.specimen.label.localeCompare(b.specimen.label))
			.set("format", (a, b) => {
				if (a.isKind("file") && b.isKind("file"))
					return a.specimen.format.localeCompare(b.specimen.format)

				if (a.isKind("file")) return -1
				if (b.isKind("file")) return 1

				return 0
			})

		const search: (terms: string[], item: CodexItem<MediaSchema>) => boolean = (terms, item) => {
			const query = terms.join(" ").trim().toLowerCase()
			if (query === "") return true

			if (item.kind === "folder") {
				return item.children.some(child => search(terms, child))
			}

			return item.specimen.label.toLowerCase().includes(query)
		}

		const codex = Codex.setup<MediaSchema>({
			folder: {icon: "📁"},
			file: {icon: "📄"},
		})

		const root = codex.root(
			codex.create("folder", {label: "project"})
		)

		const renderIcon = (item: CodexItem<MediaSchema>) => {
			return item.isKind("file")
				? formatIcons.require(item.specimen.format)
				: item.taxon.icon
		}

		return {
			codex,
			root,
			sorts,
			filters: filters,
			defaultFilter: "all",
			defaultSort: "label",
			search: (terms, item) => {
				return terms.some(term => (
					item.kind.includes(term) ||
					item.id.includes(term) ||
					item.specimen.label.includes(term)
				)) || search(terms, item)
			},
			renderIcon,
			renderLabel: item => item.specimen.label,
			renderPreview: (item: CodexItem<MediaSchema>) => {
				return (item.isKind("file") && item.specimen.previewUrl)
					? html`<img src=${item.specimen.previewUrl}>`
					: renderIcon(item)
					// // TODO icons
					// : html`<sl-icon name=${item.taxon.icon}></sl-icon>`
			},
		}
	}

	constructor() {
		super(MediaGroup.config())
	}
}

