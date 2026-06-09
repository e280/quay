
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {MediaStore} from "./store.js"

delete (globalThis as any).localStorage

export default Science.suite({
	"imports files into cellar and index": test(async() => {
		const group = new MediaStore()
		const file = new File([Txt.toBytes("hello")], "hello.txt", {type: "text/plain"})

		const [record] = await group.importFiles([file])

		expect(await group.cellar.has(record.hash)).is(true)
		expect(group.findByHash(record.hash)?.specimen.label).is("hello.txt")
	}),

	"lists media records": test(async() => {
		const store = new MediaStore()
		const file = new File([Txt.toBytes("image")], "image.png", {type: "image/png"})
		const record = await store.importFile(file)
		const records = []
		for await (const record of store.records())
			records.push(record)

		expect(records.some(r => r.hash === record.hash)).is(true)
	}),

	"removes media records and bytes": test(async() => {
		const store = new MediaStore()
		const file = new File([Txt.toBytes("image")], "image.png", {type: "image/png"})
		const record = await store.importFile(file)

		await store.remove(record.hash)

		expect(await store.cellar.has(record.hash)).is(false)
		expect(store.findByHash(record.hash)).is(undefined)
	}),
})
