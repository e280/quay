
import {MapG} from "@e280/stz"
import {Group} from "./group.js"

type RegisteredGroup<G> = G extends Group<infer _Schema> ? G : never

/**
 * Quay's global state
 *  - manages groups
 *  - each group is a different hierarchy, which can have unique types and stuff
 */
export class Brain {
	#groups = new MapG<string, Group>()

	setGroup<G>(name: string, group: RegisteredGroup<G>) {
		this.#groups.set(name, group)
		return group
	}

	getGroup<G = Group>(name: string) {
		return this.#groups.require(name) as RegisteredGroup<G>
	}
}

