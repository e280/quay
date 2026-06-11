
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {MediaLibrary} from "./library.js"
import {Permissions} from "../../permissions.js"

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

	"deletes media records and bytes": test(async() => {
		const store = new MediaLibrary()
		await store.upload([file("delete.png", "delete-image", "image/png")], store.config.root)

		const record = await recordByLabel(store, "delete.png")
		const item = store.findByHash(record.hash)!

		await store.delete(item)

		expect(await store.cellar.has(record.hash)).is(false)
		expect(store.findByHash(record.hash)).is(undefined)
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

