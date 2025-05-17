
import {css} from "@benev/slate"
export default css`

sl-tree-item::part(expand-button) {
	rotate: none;
}

sl-icon:is(.item) {
	padding: 0.5em;
}

sl-tree-item:not([data-type=folder])::part(expand-button) {
	display: none;
}

.file-import {
	position: absolute;
	opacity: 0;
	left: 0;
	width: 100%;
}

.folder-hover {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: 0;
}

sl-tree-item[data-hover] {
	border-radius: 5px;
	border: 1px solid var(--sl-color-primary-600);
}

`

