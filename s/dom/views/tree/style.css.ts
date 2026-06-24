
import {css} from "lit"
export default css`

sl-tree-item::part(expand-button) {
	rotate: none;
}

sl-tree-item::part(base) {
	min-height: var(--control-height);
	justify-content: center;
}

sl-icon:is(.item) {
	padding: var(--space-sm);
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
	min-height: var(--control-height);
	transition: background var(--transition), border-radius var(--transition);

	::part(label) {
		gap: var(--space-sm);
	}

	.folder {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	::part(item--selected) {
		background: var(--surface-selected);
		min-height: var(--control-height);
	}

}

sl-tree-item[data-hover] {
	border-radius: var(--radius-small);
	background: var(--surface-selected);
}

`

