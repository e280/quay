
import {brain} from "../context.js"
import {findGroupName} from "./find-group-name.js"

export function findLocalGroup(element: HTMLElement) {
	const name = findGroupName(element)
	return brain.getGroup(name)
}

