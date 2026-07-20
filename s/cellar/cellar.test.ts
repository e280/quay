
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {Cellar} from "./cellar.js"

const blob = (text: string) => new Blob([Txt.toBytes(text)])

export default Science.suite({
	"write + load roundtrip": test(async() => {
		const cellar = new Cellar()
		const text = "hello world"
		const file = blob(text)
		const digest = await cellar.write(file.stream())

		expect(await cellar.has(digest)).is(true)

		const loaded = await cellar.load(digest)
		expect(loaded.hash).is(digest)
		expect(await loaded.file.text()).is(text)
	}),

	"write is idempotent": test(async() => {
		const cellar = new Cellar()
		const file = blob("foo bar")
		const digest = await cellar.write(file.stream())
		expect(await cellar.write(file.stream())).is(digest)

		expect(await cellar.has(digest)).is(true)
	}),

	"delete removes file": test(async() => {
		const cellar = new Cellar()
		const file = blob("temporary data")
		const digest = await cellar.write(file.stream())

		expect(await cellar.has(digest)).is(true)

		await cellar.delete(digest)
		expect(await cellar.has(digest)).is(false)
	}),

	"load missing throws": test(async() => {
		const cellar = new Cellar()
		const fakeHash = "deadbeef1234567890"

		await expect(async() => cellar.load(fakeHash)).throwsAsync()
	}),

	"list returns saved hashes": test(async() => {
		const cellar = new Cellar()
		const texts = ["a", "b", "c"]

		for (const t of texts)
			await cellar.write(blob(t).stream())

		const hashes = []
		for await (const hash of cellar.list())
			hashes.push(hash)

		expect(hashes.length).is(3)
		for (const text of texts)
			expect(hashes.includes(await cellar.write(blob(text).stream()))).is(true)
	}),

	"clear removes all entries": test(async() => {
		const cellar = new Cellar()
		await cellar.write(blob("one").stream())
		await cellar.write(blob("two").stream())
		await cellar.write(blob("three").stream())

		let count = 0
		for await (const _ of cellar.list()) count++
		expect(count).is(3)

		await cellar.clear()

		let postClearCount = 0
		for await (const _ of cellar.list()) postClearCount++
		expect(postClearCount).is(0)
	})
})

