import {css} from "@benev/slate"

export default css`
.toolbar {
	display: flex;
	justify-content: flex-end;
	padding: 0.5rem;

	sl-button {
		background: #0F0F11;
		border-radius: 5px;

		&[data-active=true] {
			background: var(--sl-color-neutral-0);
		}

		&::part(base) {
			display: flex;
			align-items: center;
			height: 30px;
		}

		&::part(label) {
			display: flex;
			width: 40px;
		}
	}
}

.tiles,
.details {
	padding: 0.5rem;
}

.tiles {
	display: flex;
	flex-wrap: wrap;
	row-gap: 1em;
	width: 100%;

	.item {
		flex: 1;
		max-width: 150px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.media-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100px;
			height: 60px;
			border: 2px solid #0D0D0E;
			border-radius: 5px;
			background: #0F0F11;
			pointer-events: none;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.label {
			margin-top: 0.5em;
			max-width: 150px;
			font-size: 0.85rem;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--sl-color-neutral-700);
		}
	}
}

.details {
	.card {
		display: flex;
		gap: 1rem;
		padding: 0.8rem;
		border: 2px solid #0D0D0E;
		background: #0F0F11;
		border-radius: 6px;
		margin-bottom: 0.5rem;
		align-items: center;

		.meta {
			.name {
				font-weight: 500;
				color: var(--sl-color-neutral-800);
			}
			.type {
				font-size: 0.75rem;
				color: var(--sl-color-neutral-500);
			}
		}
	}
}

sl-icon {
	font-size: 2rem;
	color: var(--sl-color-neutral-300);
}

sl-tooltip {
	--sl-tooltip-arrow-size: 0;

	&::part(body) {
		background: #0D0D0E;
		color: var(--sl-color-neutral-700);
	}
}
`
