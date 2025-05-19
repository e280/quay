
import {Permission} from "./permissions.js"
import {Codex} from "./aspects/codex/codex.js"
import {Schema} from "./aspects/codex/parts/types.js"
import {CodexItem} from "./aspects/codex/parts/codex-item.js"
import { Content } from "@benev/slate"

export type SearchFn<Sc extends Schema> = (item: CodexItem<Sc>) => boolean
export type SortFn<Sc extends Schema> = (a: CodexItem<Sc>, b: CodexItem<Sc>) => number

export interface GroupConfig<Sc extends Schema> {
	codex: Codex<Sc>
	root: CodexItem<Sc>
	defaultFilter: string
	filters: Map<string, SearchFn<Sc>>
	defaultSort: string
	sorts: Map<string, SortFn<Sc>>
	search: (terms: string[], item: CodexItem<Sc>) => boolean
	renderIcon: (item: CodexItem<Sc>, opened: boolean) => Content
	renderLabel: (item: CodexItem<Sc>) => Content
	renderPreview: (item: CodexItem<Sc>) => Content
	permissions: (item: CodexItem<Sc>) => Promise<Permission>
	actions: GroupActions<Sc>
}

export interface GroupActions<Sc extends Schema> {
	newFolder: (parent: CodexItem<Sc>) => Promise<void>
	move: (item: CodexItem<Sc>, target: CodexItem<Sc>) => Promise<void>
	delete: (item: CodexItem<Sc>) => Promise<void>
	rename: (item: CodexItem<Sc>, newName: string) => Promise<void>
	upload: (files: File[], target: CodexItem<Sc>) => Promise<void>
	search: (terms: string[]) => Promise<CodexItem<Sc>[]>
	refresh: () => Promise<void>
}
