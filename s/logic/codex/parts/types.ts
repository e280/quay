
import {Content} from "@benev/slate"

export type Id = string

export type Taxon = {
	icon: Content
}

export type Specimens = {[key: string]: {}}
export type AsSpecimens<S extends Specimens> = S

export type Schema = {
	taxon: Taxon
	specimens: Specimens
}
export type AsSchema<Sc extends Schema> = Sc
export type Kind<Sc extends Schema> = keyof Sc["specimens"]
export type Taxons<Sc extends Schema> = {[K in Kind<Sc>]: Sc["taxon"]}
export type AnySpecimen<Sc extends Schema> = Sc["specimens"][Kind<Sc>]

