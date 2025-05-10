
import "@benev/slate/x/node.js"
import {repeat_string} from "@benev/turtle"

import {Codex} from "./codex.js"
import {AsSchema, Taxon} from "./parts/types.js"

export type FilesystemSchema = AsSchema<{
	taxon: Taxon
	specimens: {
		folder: {label: string}
		file: {label: string}
	}
}>

const codex = Codex.setup<FilesystemSchema>({
	folder: {icon: "📁"},
	file: {icon: "📄"},
})

const folder = codex.create("folder", {label: "project"})
const readme = codex.create("file", {label: "README.md"})
const changelog = codex.create("file", {label: "CHANGELOG.md"})

const src = codex.create("folder", {label: "src"})
const index = codex.create("file", {label: "index.ts"})
const types = codex.create("file", {label: "types.ts"})

codex.root(folder)
	.add(readme)
	.add(changelog)
	.add(src)

src
	.add(index)
	.add(types)

// project/
//   README.md
//   CHANGELOG.md
//   src/
//     index.ts
//     types.ts
for (const [item, ancestors] of folder.crawl()) {
	const indent = repeat_string(ancestors.length, "  ")
	const specimen = item.specimen
	const label = item.kind === "folder"
		? specimen.label + "/"
		: specimen.label
	console.log(indent + label)
}

