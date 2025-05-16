import {signal} from "@benev/slate"
import {Dropzone} from "./dropzone.js"
import {TreeTrail} from "./tree-trail.js"
import themeCss from "../dom/theme.css.js"
import {Schema} from "./codex/parts/types.js"
import {BrainConfig, SearchFn} from "./types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

export class QuayGroup<Sc extends Schema> {
	readonly dropzone = new Dropzone()
	readonly trail: TreeTrail<Sc>
	readonly theme = themeCss

	searchText = signal("")
	selectedFilter = signal("")

	constructor(private config: BrainConfig<Sc>) {
		this.trail = new TreeTrail<Sc>(config.root)
		this.selectedFilter.value = config.defaultFilter
	}

	get codex() {
		return this.config.codex
	}

	get root() {
		return this.config.root
	}

	get filters() {
		return this.config.filters
	}

	get defaultFilter() {
		return this.config.defaultFilter
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
