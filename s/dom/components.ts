
import {QuayBrowser} from "./components/browser/component.js"
import {QuayDropzone} from "./components/dropzone/component.js"
import {QuayOutliner} from "./components/outliner/component.js"
import {QuaySearchbar} from "./components/searchbar/component.js"
import {QuayBreadcrumb} from "./components/breadcrumb/component.js"
export {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb}

export const components = {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb}

export function setShoelaceDarkTheme() {
	document.documentElement.className = "sl-theme-dark"
}

