
import {css} from "lit"
export default css`

.dropzone {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border: var(--border-width) dashed var(--border-muted);
	border-radius: var(--radius);
	transition: background var(--transition), border-color var(--transition), color var(--transition);
}

.dz-input {
	width: 100%;
	height: 100%;
	z-index: var(--z-overlay);
	font-size: var(--font-size-sm);
	cursor: pointer;
	opacity: 0;

	&::file-selector-button {
		display: none;
	}
}

.dropzone:hover {
	background: var(--surface-hover);
}

.dropzone[data-hovering] {
	background: var(--surface-hover);
	border-color: var(--primary);

	& .dz-info {
		color: var(--primary-soft);
	}
}

.dz-info {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--space-sm);
	color: var(--text-muted);
}

`
