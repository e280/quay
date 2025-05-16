import {UseShadowComponent, UseShadowView} from "@benev/slate"
import {context} from "../context.js"
import {findGroupName} from "./find-group-name.js"

export const useQuayGroup = (use: UseShadowComponent | UseShadowView) => use.once(() => {
	const name = findGroupName(use.element)
	return context.getGroup(name) ?? context.getGroup("default")
})
