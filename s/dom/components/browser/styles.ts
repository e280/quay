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
.list,
.details,
.content {
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

.list {
	.item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.4rem 0.6rem;
		font-size: 0.85rem;
		color: var(--sl-color-neutral-700);

		.media-icon {
			width: 40px;
			height: 40px;
			font-size: 1.25rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px solid #0D0D0E;
			border-radius: 5px;
			background: #0F0F11;
		}
	}
}

.details {
	.row {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.4rem 0.8rem;
		border-bottom: 1px solid var(--sl-color-neutral-0);
		font-size: 0.85rem;
		color: var(--sl-color-neutral-700);

		.type {
			margin-left: auto;
			font-size: 0.75rem;
			color: var(--sl-color-neutral-500);
		}
	}
}

.content {
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
