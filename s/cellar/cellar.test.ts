
import {Txt} from "@e280/stz"
import {expect, Science, test} from "@e280/science"

import {Cask} from "./cask.js"
import {Cellar} from "./cellar.js"
import {MemoryForklift} from "./memory-forklift.js"

export default Science.suite({
	"save + load roundtrip": test(async() => {
		const cellar = new Cellar()
		const text = "hello world"
		const bytes = Txt.toBytes(text)
		await cellar.save(bytes)

		const hash = await Cask.hash(bytes)
		expect(await cellar.has(hash)).is(true)

		const loaded = await cellar.load(hash)
		expect(loaded.hash).is(hash)
		expect(Txt.fromBytes(loaded.bytes)).is(text)
	}),

	"save is idempotent": test(async() => {
		const cellar = new Cellar()
		const bytes = new TextEncoder().encode("foo bar")
		await cellar.save(bytes)
		await cellar.save(bytes) // again

		const hash = await Cask.hash(bytes)
		expect(await cellar.has(hash)).is(true)
	}),

	"throws on corruption": test(async() => {
		const forklift = new MemoryForklift()
		const cellar = new Cellar(forklift)
		const good = new TextEncoder().encode("valid data")
		const bad = new TextEncoder().encode("corrupt data")

		const hash = await Cask.hash(good)
		await forklift.save(hash, bad)

		await expect(async() => cellar.load(hash)).throwsAsync()
	}),

	"delete removes file": test(async() => {
		const cellar = new Cellar()
		const bytes = new TextEncoder().encode("temporary data")
		await cellar.save(bytes)

		const hash = await Cask.hash(bytes)
		expect(await cellar.has(hash)).is(true)

		await cellar.delete(hash)
		expect(await cellar.has(hash)).is(false)
	}),

	"load missing throws": test(async() => {
		const cellar = new Cellar()
		const fakeHash = "deadbeef1234567890"

		await expect(async() => cellar.load(fakeHash)).throwsAsync()
	}),
})

