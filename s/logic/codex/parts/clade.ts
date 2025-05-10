
import {MapG, sub} from "@e280/stz"
import {Taxonomy} from "./taxonomy.js"
import {AnySpecimen, Id, Kind, Schema} from "./types.js"

export class Clade<Sc extends Schema> {
	onChange = sub()
	#specimens = new MapG<Id, [Kind<Sc>, AnySpecimen<Sc>]>()

	constructor(public taxonomy: Taxonomy<Sc>) {}

	getSpecimen<K extends Kind<Sc> = Kind<Sc>>(id: string) {
		return this.#specimens.require(id) as [K, Sc["specimens"][K]]
	}

	setSpecimen<K extends Kind<Sc>>(id: string, kind: K, specimen: Sc["specimens"][K]) {
		this.#specimens.set(id, [kind, specimen])
		this.onChange.pub()
	}

	query<K extends Kind<Sc> = Kind<Sc>>(id: Id) {
		const [kind, specimen] = this.getSpecimen<K>(id)
		const taxon = this.taxonomy.taxon(kind)
		return {kind, taxon, specimen}
	}
}

