
import "@benev/slate/x/node.js"
import {Science} from "@e280/science"
import cellar from "./cellar/cellar.test.js"
import media from "./logic/presets/media/store.test.js"

await Science.run({
	cellar,
	media
})

