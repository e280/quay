import {QuayDropzone} from "./components/dropzone/component.js"
import {QuayOutliner} from "./components/outliner/component.js"
import {QuaySearchbar} from "./components/searchbar/component.js"
export {QuayOutliner, QuaySearchbar}

export const components = {QuayOutliner, QuaySearchbar, QuayDropzone}

export function setShoelaceDarkTheme() {
	document.documentElement.className = "sl-theme-dark"
}

