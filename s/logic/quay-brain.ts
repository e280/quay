import {BrainConfig} from "./types.js"
import {QuayGroup} from "./quay-group.js"
import {Schema} from "./codex/parts/types.js"

export class QuayBrain<Sc extends Schema> {
	#groups = new Map<string, QuayGroup<any>>()

	createGroup(name: string, config: BrainConfig<Sc>) {
		if(this.#groups.has(name)) {
			throw new Error(`Group "${name}" already exists.`)
		}
		const group = new QuayGroup(config)
		this.#groups.set(name, group)
		return group
	}

	getGroup(name: string) {
		const group = this.#groups.get(name)
		if(!group) throw new Error(`Group "${name}" does not exist.`)
		return group as QuayGroup<Sc>
	}
}
