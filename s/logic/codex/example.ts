
import "@benev/slate/x/node.js"
import {repeat_string} from "@benev/turtle"

import {Codex} from "./codex.js"
import {AsSchema, Taxon} from "./parts/types.js"

//
// a Schema is all the type information for customizing Quay
//  - *taxon* is like "folders have this icon"
//  - *specimen* is like "this particular folder has this label"
//
export type FilesystemSchema = AsSchema<{
	taxon: Taxon
	specimens: {
		folder: {label: string}
		file: {label: string}
	}
}>

// we create a codex that uses our schema, and specifies these icons
const codex = Codex.setup<FilesystemSchema>({
	folder: {icon: "📁"},
	file: {icon: "📄"},
})

// let's create a folder with some crap
const folder = codex.create("folder", {label: "project"})
const readme = codex.create("file", {label: "README.md"})
const changelog = codex.create("file", {label: "CHANGELOG.md"})

// let's create a subfolder with more crap
const src = codex.create("folder", {label: "src"})
const index = codex.create("file", {label: "index.ts"})
const types = codex.create("file", {label: "types.ts"})

// we attach the folder as the root, and attach its children
codex.root(folder)
	.add(readme)
	.add(changelog)
	.add(src) // <-- this is the subfolder

// and we attach the subfolder items to it
src
	.add(index)
	.add(types)

	//                   we can crawl any folder!
	//                                    👇
for (const [item, ancestors] of folder.crawl()) {
	const indent = repeat_string(ancestors.length, "  ")
	const specimen = item.specimen
	const label = item.kind === "folder"
		? specimen.label + "/"
		: specimen.label
	console.log(indent + label)
}

// project/
//   README.md
//   CHANGELOG.md
//   src/
//     index.ts
//     types.ts

