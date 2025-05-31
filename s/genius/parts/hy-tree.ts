
import {Kv, collect} from "@e280/kv"

export type HyId = string
export type HyItem = {parent: HyId | null, children: HyId[]}
type HyRecord = [parent: HyId | null, children: HyId[]]

/**
 * Async hierarchy of nestable items.
 *  - items can have multiple children.
 *  - items can only have one parent.
 *  - items can be orphans (bring your own concept of a "root").
 */
export class HyTree {
	constructor(private records: Kv<HyRecord>) {}

	async has(id: HyId) {
		return this.records.has(id)
	}

	async get(id: HyId): Promise<HyItem | undefined> {
		const record = await this.records.get(id)
		if (record) {
			const [parent, children] = record
			return {parent, children}
		}
	}

	async gets(...ids: HyId[]): Promise<(HyItem | undefined)[]> {
		const records = await this.records.gets(...ids)
		return records.map(r => {
			if (!r) return undefined
			const [parent, children] = r
			return {parent, children}
		})
	}

	async require(id: HyId): Promise<HyItem> {
		const record = await this.records.require(id)
		const [parent, children] = record
		return {parent, children}
	}

	async requires(...ids: HyId[]): Promise<HyItem[]> {
		const records = await this.records.requires(...ids)
		return records.map(([parent, children]) => ({parent, children}))
	}

	/** establish an id as a root with no parents, but ready to accept children */
	async establishRoot(root: HyId) {
		return this.records.set(root, [null, []])
	}

	/** give a parent some children  */
	async attach(parent: HyId, ...children: HyId[]) {
		children = [...new Set(children)]
		const parentItem = await this.require(parent)
		const siblings = new Set(parentItem.children)
		const childItems = await this.gets(...children)
		const newcomers: [HyId, HyRecord][] = []

		for (const [index, id] of children.entries()) {
			const item = childItems.at(index)

			// child already in tree
			if (item && item.parent) throw new Error(`child already has parent`)

			// child not in tree yet, remember to save it
			else newcomers.push([id, [parent, []]])

			// add to siblings set
			siblings.add(id)
		}

		// save all new children
		await this.records.sets(...newcomers)

		// save updated parent item
		await this.records.set(parent, [parentItem.parent, [...siblings]])
	}

	/** detach this id from its parent in the hierarchy */
	async detach(id: HyId) {
		const item = await this.get(id)
		if (!item) return undefined

		if (item.parent) {
			const parentItem = await this.require(item.parent)
			const siblings = new Set(parentItem.children)
			siblings.delete(id)

			// save the parent item with removed child
			await this.records.set(item.parent, [parentItem.parent, [...siblings]])

			// save the child with null parent
			await this.records.set(id, [null, item.children])
		}
	}

	/** destroy all relations associated with this id, and all its descendants */
	async destroy(id: HyId) {
		await this.detach(id)
		const tree = await collect(this.crawl(id))
		const ids = tree.map(({id}) => id)
		await this.records.del(...ids)
	}

	/** delete absolutely everything */
	async clear() {
		await this.records.clear()
	}

	/** iterate over all root items */
	async *roots() {
		for await (const [id, [parent, children]] of this.records.entries())
			if (parent === null)
				yield {id, item: {parent, children}} as {id: HyId, item: HyItem}
	}

	/** iterate over this id and all its descendants */
	async *crawl(
			id: HyId,
			predicate: (id: HyId, path: HyId[]) => Promise<boolean> = async() => true,
		) {

		const todo: [item: HyId, path: HyId[]][] = [[id, []]]
		const seen = new Set<HyId>()

		while (todo.length) {
			const [id, path] = todo.shift()!
			if (seen.has(id) || !await predicate(id, path)) continue
			seen.add(id)

			const item = await this.require(id)
			yield {id, item, path} as {id: HyId, item: HyItem, path: HyId[]}

			for (const childId of item.children)
				todo.push([childId, [...path, id]])
		}
	}
}

