
import {MapG} from "@e280/stz"
import {Content, html} from "@benev/slate"

import {Group} from "../../group.js"
import {GroupConfig, SearchFn} from "../../types.js"
import {Codex} from "../../aspects/codex/codex.js"
import {MediaFormat, MediaSchema} from "./schema.js"
import { CodexItem } from "../../aspects/codex/parts/codex-item.js"

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

		return {
			codex,
			root,
			filters: filters,
			defaultFilter: "all",
			search: (terms, item) => {
				return terms.some(term => (
					item.kind.includes(term) ||
					item.id.includes(term) ||
					item.specimen.label.includes(term)
				)) || search(terms, item)
			},
			renderLabel: item => item.specimen.label,
			renderIcon: item => item.isKind("file")
				? formatIcons.require(item.specimen.format)
				: item.taxon.icon,
			renderPreview: (item: CodexItem<MediaSchema>) => {
				return (item.isKind("file") && item.specimen.previewUrl)
					? html`<img src=${item.specimen.previewUrl}>`
					: html`<sl-icon name=${item.taxon.icon}></sl-icon>`
			},
		}
	}

	constructor() {
		super(MediaGroup.config())
	}
}

