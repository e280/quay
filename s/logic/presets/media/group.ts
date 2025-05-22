
import {MapG} from "@e280/stz"
import {Content, html} from "@benev/slate"

import Quay from "../../../index.js"
import {Group} from "../../group.js"
import {Codex} from "../../aspects/codex/codex.js"
import {MediaFormat, MediaSchema} from "./schema.js"
import {GroupConfig, SearchFn, SortFn} from "../../types.js"
import {CodexItem} from "../../aspects/codex/parts/codex-item.js"

export class MediaGroup extends Group<MediaSchema> {
	static config = (): GroupConfig<MediaSchema> => {
		const formatIcons = new MapG<MediaFormat, Content>()
			.set("audio", html`<sl-icon name=music-note-beamed></sl-icon>`)
			.set("video", html`<sl-icon name=film></sl-icon>`)
			.set("image", html`<sl-icon name=image></sl-icon>`)
			.set("other", html`<sl-icon name=file-earmark></sl-icon>`)

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
			folder: {icon: html`<sl-icon name="folder"></sl-icon>`},
			file: {icon: html`<sl-icon name="file"></sl-icon>`},
		})

		const root = codex.root(
			codex.create("folder", {label: "project"})
		)

		const renderIcon = (item: CodexItem<MediaSchema>, opened: boolean) => {
			return item.isKind("file")
				? formatIcons.require(item.specimen.format)
				: opened ? html`<sl-icon name="folder2-open"></sl-icon>` : item.taxon.icon
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
					: renderIcon(item, false)
					// // TODO icons
					// : html`<sl-icon name=${item.taxon.icon}></sl-icon>`
			},
			permissions: item => Quay.permissions.all,
		}
	}

	constructor() {
		super(MediaGroup.config())
	}
}

