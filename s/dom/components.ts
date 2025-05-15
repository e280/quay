
import {QuayBrowser} from "./components/browser/component.js"
import {QuayDropzone} from "./components/dropzone/component.js"
import {QuayOutliner} from "./components/outliner/component.js"
import {QuayFilter} from "./components/quay-filter/component.js"
import {QuaySearchbar} from "./components/searchbar/component.js"
import {QuayBreadcrumb} from "./components/breadcrumb/component.js"
export {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb, QuayFilter}

export const components = {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb, QuayFilter}

export function setShoelaceDarkTheme() {
	document.documentElement.className = "sl-theme-dark"
}

