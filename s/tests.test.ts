
import {Science} from "@e280/science"
import cellar from "./cellar/cellar.test.js"
import media from "./logic/presets/media/library.test.js"

await Science.run({
	cellar,
	media
})

