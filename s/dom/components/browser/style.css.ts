
import {css} from "lit"
export default css`

.toolbar {
	display: flex;
	justify-content: flex-end;
	padding: var(--space-sm);

	sl-button {
		background: var(--surface);
		border-radius: var(--radius-small);

		&[data-active=true] {
			background: var(--surface-active);
		}

		&::part(base) {
			display: flex;
			align-items: center;
			height: var(--control-height);
			border-radius: var(--radius-small);
		}

		&::part(label) {
			display: flex;
			width: var(--control-width);
		}
	}
}

.tiles,
.details {
	padding: var(--space-sm);
}

.tiles {
	display: flex;
	flex-wrap: wrap;
	row-gap: var(--space-md);
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
			width: var(--quay-browser-thumb-width, 100px);
			height: var(--quay-browser-thumb-height, 60px);
			border: var(--border-width) solid var(--border);
			border-radius: var(--radius-small);
			background: var(--surface);
			pointer-events: none;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.label {
			margin-top: var(--space-xs);
			max-width: 150px;
			font-size: var(--font-size-sm);
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--text-muted);
		}
	}
}

.details {
	.card {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-sm);
		border: var(--border-width) solid var(--border);
		background: var(--surface);
		border-radius: var(--radius);
		margin-bottom: var(--space-sm);
		align-items: center;

		.meta {
			.name {
				font-weight: 500;
				color: var(--text);
			}
			.type {
				font-size: var(--font-size-xs);
				color: var(--text-subtle);
			}
		}
	}
}

sl-icon {
	font-size: var(--icon-size);
	color: var(--icon);
}

sl-tooltip {
	--sl-tooltip-arrow-size: 0;

	&::part(body) {
		background: var(--border);
		color: var(--text-muted);
	}
}

`
