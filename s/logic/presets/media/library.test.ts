
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {MediaLibrary} from "./library.js"
import {Permissions} from "../../permissions.js"
import {Cellar} from "../../../cellar/cellar.js"

delete (globalThis as any).localStorage

export default Science.suite({
	"uploads files into cellar and index": test(async() => {
		const group = new MediaLibrary()
		await group.upload([file("hello.txt", "hello")], group.config.root)

		const record = await recordByLabel(group, "hello.txt")
		const item = group.findByHash(record.hash)!

		expect(item.specimen.label).is("hello.txt")
		expect(await group.cellar.has(record.hash)).is(true)
	}),

	"upload respects upload permission": test(async() => {
		const group = new MediaLibrary()
		const file = new File([Txt.toBytes("hello")], "hello.txt", {type: "text/plain"})
		group.config.permissions = () => Permissions.readOnly

		expect(() => group.upload([file], group.config.root)).throws()
	}),

	"lists media records": test(async() => {
		const store = new MediaLibrary()
		await store.upload([file("image.png", "image", "image/png")], store.config.root)

		expect(await recordByLabel(store, "image.png")).ok()
	}),

	"deletes media records and resources explicitly": test(async() => {
		const store = new MediaLibrary()
		await store.upload([file("delete.png", "delete-image", "image/png")], store.config.root)

		const record = await recordByLabel(store, "delete.png")
		const item = store.findByHash(record.hash)!

		await store.delete(item)

		expect(store.findByHash(record.hash)).is(undefined)
		expect(await store.cellar.has(record.hash)).is(true)

		await store.deleteResource(record.hash)
		expect(await store.cellar.has(record.hash)).is(false)
	}),

	"parent deletion removes child records while project deletion stays local": test(async() => {
		const storage = Object.create({
			getItem(this: Record<string, string>, key: string) { return this[key] ?? null },
			setItem(this: Record<string, string>, key: string, value: string) { this[key] = value },
			removeItem(this: Record<string, string>, key: string) { delete this[key] },
		})
		const originalOpen = Cellar.opfs
		const cellar = new Cellar()
		const opened: MediaLibrary[] = []
		try {
			Object.defineProperty(globalThis, "localStorage", {value: storage, configurable: true})
			Cellar.opfs = async() => cellar
			const open = async(scope: string) => {
				const library = await MediaLibrary.open(scope)
				opened.push(library)
				return library
			}
			const a = await open("app:a")
			const b = await open("app:b")
			const other = await open("app-other")
			for (const library of [a, b, other])
				await library.upload([file("shared.txt", "shared")], library.config.root)
			await b.upload([file("keep.txt", "keep")], b.config.root)
			const {hash} = await recordByLabel(a, "shared.txt")
			const main = await open("app")
			await main.upload([file("shared.txt", "shared")], main.config.root)

			await a.delete(a.findByHash(hash)!)
			expect((await records(a)).length).is(0)
			expect((await records(b)).length).is(2)
			await main.delete(main.findByHash(hash)!)
			expect((await records(main)).length).is(1)
			expect((await records(await open("app:b"))).map(r => r.label).join()).is("keep.txt")
			expect((await records(other)).length).is(1)
			expect(await cellar.has(hash)).is(true)
		}
		finally {
			for (const library of opened) library.dispose()
			Cellar.opfs = originalOpen
			delete (globalThis as any).localStorage
		}
	}),

})

function file(name: string, text: string, type = "text/plain") {
	return new File([Txt.toBytes(text)], name, {type})
}

async function records(store: MediaLibrary) {
	const records = []
	for await (const record of store.records())
		records.push(record)
	return records
}

async function recordByLabel(store: MediaLibrary, label: string) {
	const record = (await records(store)).find(r => r.label === label)
	if (!record)
		throw new Error(`expected record "${label}"`)
	return record
}
