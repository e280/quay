
import {Content} from "@benev/slate"

export type Id = string

/**
 * information about a "kind"
 *  - eg, what icon "folder" or "file" kinds might have
 */
export type Taxon = {
	icon: Content
}

/** each item "kind" has its own "specimen" type */
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

