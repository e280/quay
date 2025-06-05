
export {register, css} from "@benev/slate"

export * from "./cellar/index.js"

export * from "./dom/components.js"
import {Permissions} from "./logic/permissions.js"

const Quay = {
	permissions: Permissions,
}

export default Quay

