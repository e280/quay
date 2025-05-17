import {QuaySort} from "./components/sort/component.js"
import {QuayFilter} from "./components/filter/component.js"
import {QuayBrowser} from "./components/browser/component.js"
import {QuayDropzone} from "./components/dropzone/component.js"
import {QuayOutliner} from "./components/outliner/component.js"
import {QuaySearchbar} from "./components/searchbar/component.js"
import {QuayBreadcrumb} from "./components/breadcrumb/component.js"
export {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb, QuayFilter, QuaySort}

export const components = {QuayOutliner, QuaySearchbar, QuayDropzone, QuayBrowser, QuayBreadcrumb, QuayFilter, QuaySort}

export function setShoelaceDarkTheme() {
	document.documentElement.className = "sl-theme-dark"
}

