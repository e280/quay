
import {css} from "@benev/slate"
export default css`

sl-tree-item::part(expand-button) {
	rotate: none;
}

sl-tree-item::part(base) {
	min-height: 30px;
	justify-content: center;
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

sl-tree-item {
	min-height: 30px;
	transition: background 0.2s ease, border-radius 0.2s ease;

	::part(label) {
		gap: 0.5em;
	}

	.folder {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	::part(item--selected) {
		background: rgba(0, 0, 0, 0.4);
		min-height: 30px;
	}

}

sl-tree-item[data-hover] {
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.4);
}

`

