
import {MapG} from "@e280/stz"
import {Group} from "./group.js"

/**
 * Quay's global state
 *  - manages groups
 *  - each group is a different hierarchy, which can have unique types and stuff
 */
export class Brain {
	#groups = new MapG<string, Group<any>>()

	setGroup<G extends Group>(name: string, group: G) {
		this.#groups.set(name, group)
		return group
	}

	getGroup<G extends Group>(name: string) {
		return this.#groups.require(name) as G
	}
}

