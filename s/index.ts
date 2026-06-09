
export {register, css} from "@benev/slate"

export * from "./cellar/index.js"

export * from "./dom/components.js"
export {brain} from "./dom/context.js"
export * from "./logic/presets/media/schema.js"
export * from "./logic/presets/media/group.js"
export * from "./logic/presets/media/store.js"
import {Permissions} from "./logic/permissions.js"

const Quay = {
	permissions: Permissions,
}

export default Quay

