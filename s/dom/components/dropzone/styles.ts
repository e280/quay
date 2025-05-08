import {css} from "@benev/slate"

export default css`
.dropzone {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border: 2px dashed var(--sl-color-neutral-300);
	border-radius: 6px;
	transition: background 0.2s;
}

.dz-input {
	z-index: 999;
	height: 100px;
	font-size: 14px;
	cursor: pointer;
	opacity: 0;

	&::file-selector-button {
		display: none;
	}
}

.dropzone:hover {
	background: var(--sl-color-gray-50);
}

.dropzone.hovering {
	background: var(--sl-color-gray-50);
	border-color: var(--sl-color-primary-500);

	& .dz-info {
		color: var(--sl-color-primary-300);
	}
}

.dz-info {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5em;
	color: var(--sl-color-neutral-700);
}
`
