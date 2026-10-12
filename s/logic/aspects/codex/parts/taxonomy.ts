
import {need} from "@e280/stz"
import {Kind, Schema, Taxons} from "./types.js"

/** Defines the static details about each "kind" of data */
export class Taxonomy<Sc extends Schema> {
	#taxons = new Map<Kind<Sc>, Sc["taxon"]>()

	constructor(taxons: Taxons<Sc>) {
		for (const [kind, taxon] of Object.entries(taxons))
			this.#taxons.set(kind, taxon)
	}

	taxon<K extends Kind<Sc>>(kind: K) {
		return need(this.#taxons, kind) as Sc["taxon"]
	}
}

