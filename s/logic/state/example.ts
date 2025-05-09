
import "@benev/slate/x/node.js"
import {repeat_string} from "@benev/turtle"
import {State} from "./state.js"

//
// we can invent any scheme for the items in our state.
// here is a filesystem scheme.
//

export namespace FileSystem {
	export type Folder = {
		kind: "folder"
		label: string
	}
	export type File = {
		kind: "file"
		label: string
		hash: string
	}
	export type Any = Folder | File
}

//
// now here's a demo doing various things with the state
//

const state = State.init<FileSystem.Any>({
	kind: "folder",
	label: "My root folder",
})

// we can listen to the signal
state.signal.on(() => console.log("state structure changed"))

// making some files
const readme = state.make({kind: "file", label: "README.md", hash: "deadbeef"})
const license = state.make({kind: "file", label: "LICENSE", hash: "deadbeef"})
const changelog = state.make({kind: "file", label: "CHANGELOG.md", hash: "deadbeef"})

// putting them in the root folder
state.root
	.add(readme)
	.add(license)
	.add(changelog)

// creating a new subfolder
const subfolder = state.insert(state.root, {kind: "folder", label: "s"})

// adding a couple files to the subfolder
subfolder
	.add(state.make({kind: "file", label: "main.ts", hash: "deadbeef"}))
	.add(state.make({kind: "file", label: "types.ts", hash: "deadbeef"}))

// log a pretty indented tree view
for (const [item, ancestors] of state.crawl(state.root)) {
	const indent = repeat_string(ancestors.length, "  ")
	const scheme = item.scheme.value
	const label = scheme.kind === "folder"
		? scheme.label + "/"
		: scheme.label
	console.log(indent + label)
}

// My root folder/
//   README.md
//   LICENSE
//   CHANGELOG.md
//   s/
//     main.ts
//     types.ts

