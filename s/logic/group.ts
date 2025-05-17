
import {signal} from "@benev/slate"
import {Dropzone} from "./aspects/dropzone.js"
import {GroupConfig, SearchFn} from "./types.js"
import {TreeTrail} from "./aspects/tree-trail.js"
import {Schema} from "./aspects/codex/parts/types.js"
import {CodexItem} from "./aspects/codex/parts/codex-item.js"

export class Group<Sc extends Schema = any> {
	trail: TreeTrail<Sc>
	dropzone = new Dropzone()
	searchText = signal("")
	selectedFilter = signal("")

	constructor(public config: GroupConfig<Sc>) {
		this.selectedFilter.value = config.defaultFilter
		this.trail = new TreeTrail(config.root)
	}

	getFilterFn(filterKey: string): SearchFn<Sc> {
		return this.config.filters.get(filterKey) ?? (() => true)
	}

	getSearchFn(searchText: string): SearchFn<Sc> {
		const terms = searchText.trim().toLowerCase().split(/\s+/)
		return item => this.config.search(terms, item)
	}

	matches(item: CodexItem<Sc>) {
		const filterFn = this.getFilterFn(this.selectedFilter.value)
		const searchFn = this.getSearchFn(this.searchText.value)
		return filterFn(item) && searchFn(item)
	}

	components = () => this.components
}

