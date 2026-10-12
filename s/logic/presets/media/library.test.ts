
import {expect, Science, test} from "@e280/science"

import {MediaLibrary} from "./library.js"
import {Permissions} from "../../permissions.js"

delete (globalThis as any).localStorage

export default Science.suite({
	"uploads files into cellar and index": test(async() => {
		const group = new MediaLibrary()
		const project = await group.scope("upload-project")
		await project.upload([file("hello.txt", "hello")], project.config.root)

		const record = await recordByLabel(project, "hello.txt")
		const item = project.findByHash(record.hash)!

		expect(item.specimen.label).is("hello.txt")
		expect(group.findByHash(record.hash)).ok()
		expect(await group.cellar.has(record.hash)).is(true)
	}),

	"upload respects upload permission": test(async() => {
		const group = new MediaLibrary()
		const file = new File(["hello"], "hello.txt", {type: "text/plain"})
		group.config.permissions = () => Permissions.readOnly

		expect(() => group.upload([file], group.config.root)).throws()
	}),

	"lists media records": test(async() => {
		const store = new MediaLibrary()
		await store.upload([file("image.png", "image", "image/png")], store.config.root)

		expect(await recordByLabel(store, "image.png")).ok()
	}),

	"includes existing media in a scope": test(async() => {
		const library = new MediaLibrary()
		await library.upload([file("include.txt", "include")], library.config.root)
		const record = await recordByLabel(library, "include.txt")
		const project = await library.scope("include-project")
		const favorites = await project.scope("favorites")

		await favorites.include(record.hash)

		expect(project.findByHash(record.hash)).ok()
		expect(favorites.findByHash(record.hash)).ok()
		expect(await project.cellar.has(record.hash)).is(true)
		await favorites.delete(favorites.findByHash(record.hash)!)
		expect(project.findByHash(record.hash)).ok()
		await expect(() => project.include("missing")).throwsAsync()
	}),

	"root deletion removes media records and resources": test(async() => {
		const store = new MediaLibrary()
		await store.upload([file("delete.png", "delete-image", "image/png")], store.config.root)

		const record = await recordByLabel(store, "delete.png")
		const item = store.findByHash(record.hash)!
		const project = await store.scope("delete-project")
		await project.include(record.hash)

		await store.delete(item)

		expect(store.findByHash(record.hash)).is(undefined)
		expect(project.findByHash(record.hash)).is(undefined)
		expect(await store.cellar.has(record.hash)).is(false)
		const reopened = await store.scope("delete-project")
		expect(reopened.findByHash(record.hash)).is(undefined)
	}),

	"scope deletion removes descendants but preserves ancestors and siblings": test(async() => {
		const library = new MediaLibrary()
		await library.upload([file("subtree-delete.txt", "subtree-delete")], library.config.root)
		const record = await recordByLabel(library, "subtree-delete.txt")
		const project = await library.scope("subtree-project")
		const favorites = await project.scope("favorites")
		const sibling = await library.scope("subtree-sibling")
		await favorites.include(record.hash)
		await sibling.include(record.hash)
		favorites.dispose()

		await project.delete(project.findByHash(record.hash)!)
		const reopened = await project.scope("favorites")
		expect(reopened.findByHash(record.hash)).is(undefined)
		expect(library.findByHash(record.hash)).ok()
		expect(sibling.findByHash(record.hash)).ok()
		expect(await library.cellar.has(record.hash)).is(true)
	}),

})

function file(name: string, text: string, type = "text/plain") {
	return new File([text], name, {type})
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
