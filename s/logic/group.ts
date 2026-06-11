import {sub} from "@e280/stz"
import {signal} from "@e280/strata"

import {Permission} from "./permissions.js"
import {Dropzone} from "./aspects/dropzone.js"
import {TreeTrail} from "./aspects/tree-trail.js"
import {Schema} from "./aspects/codex/parts/types.js"
import {GroupConfig, SearchFn, SortFn} from "./types.js"
import {CodexItem} from "./aspects/codex/parts/codex-item.js"

export class Group<Sc extends Schema = any> {
	trail: TreeTrail<Sc>
	dropzone = new Dropzone(this)
	searchText = signal("")
	selectedFilter = signal("")
	selectedSort = signal("")

	on = {
		newFolder: sub<[{parent: CodexItem<Sc>}]>(),
		move: sub<[{item: CodexItem<Sc>, target: CodexItem<Sc>}]>(),
		delete: sub<[{items: CodexItem<Sc>[]}]>(),
		rename: sub<[{item: CodexItem<Sc>, newName: string}]>(),
		upload: sub<[{files: File[], target: CodexItem<Sc>}]>(),
		search: sub<[{terms: string[]}]>(),
		refresh: sub<[{}]>(),
	}

	constructor(public config: GroupConfig<Sc>) {
		this.selectedFilter(config.defaultFilter)
		this.selectedSort(config.defaultSort)
		this.trail = new TreeTrail(config.root)
	}

	get permissions() {
		return this.config.permissions as (item: CodexItem<Sc>) => Permission
	}

	getFilterFn(filterKey: string): SearchFn<Sc> {
		return this.config.filters.get(filterKey) ?? (() => true)
	}

	getSearchFn(searchText: string): SearchFn<Sc> {
		const terms = searchText.trim().toLowerCase().split(/\s+/)
		return item => this.config.search(terms, item)
	}

	getSortFn(sortKey: string): SortFn<Sc> {
		return this.config.sorts?.get(sortKey) ?? (() => 0)
	}

	sort(items: CodexItem<Sc>[]): CodexItem<Sc>[] {
		const sortFn = this.getSortFn(this.selectedSort())
		return [...items].sort(sortFn)
	}

	matches(item: CodexItem<Sc>) {
		const filterFn = this.getFilterFn(this.selectedFilter())
		const searchFn = this.getSearchFn(this.searchText())
		return filterFn(item) && searchFn(item)
	}

	move(item: CodexItem<Sc>, target: CodexItem<Sc>) {
		if(!this.permissions(item).move)
			throw new Error("move permission not granted")

		item.detach()
		target.attach(item)

		this.on.move.pub({item, target})
	}

	delete(item: CodexItem<Sc>) {
		if(!this.permissions(item).delete)
			throw new Error("delete permission not granted")

		const items = [...item.crawl()].map(([item]) => item)

		item.destroy()

		return this.on.delete.pub({items})
	}

	rename(item: CodexItem<Sc>, newName: string) {
		if(!this.permissions(item).rename)
			throw new Error("rename permission not granted")

		this.on.rename.pub({item, newName})
	}

	upload(files: File[], folder: CodexItem<Sc>) {
		if(!this.permissions(folder).upload)
			throw new Error("upload permission not granted")

		return this.on.upload.pub({files, target: folder})
	}

	addFolder(parent: CodexItem<Sc>) {
		if(!this.permissions(parent).newFolder)
			throw new Error("add folder permission not granted")

		this.on.newFolder.pub({parent})
	}

	components = () => this.components
}

