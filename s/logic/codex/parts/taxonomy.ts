
import {MapG} from "@e280/stz"
import {Kind, Schema, Taxons} from "./types.js"

export class Taxonomy<Sc extends Schema> {
	#taxons = new MapG<Kind<Sc>, Sc["taxon"]>()

	constructor(taxons: Taxons<Sc>) {
		for (const [kind, taxon] of Object.entries(taxons))
			this.#taxons.set(kind, taxon)
	}

	taxon<K extends Kind<Sc>>(kind: K) {
		return this.#taxons.require(kind) as Sc["taxon"]
	}
}

