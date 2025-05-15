import {SearchFn} from "./types.js"
import {Dropzone} from "./dropzone.js"
import {Codex} from "./codex/codex.js"
import {TreeTrail} from "./tree-trail.js"
import themeCss from "../dom/theme.css.js"
import {Schema} from "./codex/parts/types.js"
import {CodexItem} from "./codex/parts/codex-item.js"

interface BrainConfig<Sc extends Schema> {
	codex: Codex<Sc>
	root: CodexItem<Sc>
	defaultFilter: string
	filters: Map<string, SearchFn<Sc>>
	search: (terms: string[], item: CodexItem<Sc>) => boolean
}

export class QuayBrain<Sc extends Schema> {
	readonly dropzone = new Dropzone()
	readonly trail = new TreeTrail(this.root)
	readonly theme = themeCss

	constructor(private config: BrainConfig<Sc>) {}

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

	getCombinedFn(filterKey: string, searchText: string): SearchFn<Sc> {
		const filterFn = this.getFilterFn(filterKey)
		const searchFn = this.getSearchFn(searchText)
		return item => filterFn(item) && searchFn(item)
	}

	components = () => this.components
}
