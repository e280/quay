
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {Cask} from "./cask.js"
import {Cellar} from "./cellar.js"
import {MemoryForklift} from "./memory-forklift.js"

const blob = (text: string) => new Blob([Txt.toBytes(text)])

export default Science.suite({
	"save + load roundtrip": test(async() => {
		const cellar = new Cellar()
		const text = "hello world"
		const file = blob(text)
		await cellar.save(file)

		const hash = await Cask.hash(file)
		expect(await cellar.has(hash)).is(true)

		const loaded = await cellar.load(hash)
		expect(loaded.hash).is(hash)
		expect(await loaded.file.text()).is(text)
	}),

	"save is idempotent": test(async() => {
		const cellar = new Cellar()
		const file = blob("foo bar")
		await cellar.save(file)
		await cellar.save(file) // again

		const hash = await Cask.hash(file)
		expect(await cellar.has(hash)).is(true)
	}),

	"throws on corruption": test(async() => {
		const forklift = new MemoryForklift()
		const cellar = new Cellar(forklift)
		const good = blob("valid data")
		const bad = blob("corrupt data")

		const hash = await Cask.hash(good)
		await forklift.save(hash, bad)

		await expect(async() => cellar.load(hash)).throwsAsync()
	}),

	"delete removes file": test(async() => {
		const cellar = new Cellar()
		const file = blob("temporary data")
		await cellar.save(file)

		const hash = await Cask.hash(file)
		expect(await cellar.has(hash)).is(true)

		await cellar.delete(hash)
		expect(await cellar.has(hash)).is(false)
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
			await cellar.save(blob(t))

		const hashes = []
		for await (const hash of cellar.list())
			hashes.push(hash)

		expect(hashes.length).is(3)
		for (const t of texts) {
			const h = await Cask.hash(blob(t))
			expect(hashes.includes(h)).is(true)
		}
	}),

	"clear removes all entries": test(async() => {
		const cellar = new Cellar()
		await cellar.save(blob("one"))
		await cellar.save(blob("two"))
		await cellar.save(blob("three"))

		let count = 0
		for await (const _ of cellar.list()) count++
		expect(count).is(3)

		await cellar.clear()

		let postClearCount = 0
		for await (const _ of cellar.list()) postClearCount++
		expect(postClearCount).is(0)
	})
})

