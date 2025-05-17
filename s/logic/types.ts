
import {Codex} from "./aspects/codex/codex.js"
import {Schema} from "./aspects/codex/parts/types.js"
import {CodexItem} from "./aspects/codex/parts/codex-item.js"
import { Content } from "@benev/slate"

export type SearchFn<Sc extends Schema> = (item: CodexItem<Sc>) => boolean

export interface GroupConfig<Sc extends Schema> {
	codex: Codex<Sc>
	root: CodexItem<Sc>
	defaultFilter: string
	filters: Map<string, SearchFn<Sc>>
	search: (terms: string[], item: CodexItem<Sc>) => boolean
	renderIcon: (item: CodexItem<Sc>) => Content
	renderLabel: (item: CodexItem<Sc>) => Content
	renderPreview: (item: CodexItem<Sc>) => Content
}

