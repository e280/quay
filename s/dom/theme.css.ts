
import {css} from "lit"
export default css`@layer theme, view; @layer theme {

:host {
	--surface: var(--quay-surface, #0f0f11);
	--surface-active: var(--quay-surface-hover, var(--sl-color-neutral-0, #fff));
	--surface-hover: var(--quay-surface-hover, var(--sl-color-gray-50, #f8f9fa));
	--surface-selected: var(--quay-surface-selected, rgb(0 0 0 / 40%));
	--border: var(--quay-border, #0d0d0e);
	--border-muted: var(--quay-border, var(--sl-color-neutral-300, #d0d0d0));
	--border-width: 1px;
	--text: var(--quay-text, var(--sl-color-neutral-800, #333));
	--text-muted: var(--quay-muted, var(--sl-color-neutral-700, #555));
	--text-subtle: var(--quay-muted, var(--sl-color-neutral-500, #777));
	--icon: var(--quay-muted, var(--sl-color-neutral-300, #d0d0d0));
	--primary: var(--quay-accent, var(--sl-color-primary-500, #0ea5e9));
	--primary-soft: color-mix(in srgb, var(--primary), white 65%);
	--radius: var(--quay-radius, var(--sl-border-radius-medium, 6px));
	--radius-small: var(--sl-border-radius-small, var(--radius));
	--space-xs: var(--sl-spacing-2x-small, 0.3em);
	--space-sm: var(--sl-spacing-x-small, 0.5rem);
	--space-md: var(--sl-spacing-medium, 1rem);
	--font-size-xs: var(--sl-font-size-x-small, 0.75rem);
	--font-size-sm: var(--sl-font-size-small, 0.85rem);
	--control-height: 30px;
	--control-width: 40px;
	--icon-size: 2rem;
	--z-overlay: 999;
	--transition: 0.2s ease;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

sl-button::part(base) {
	border-color: var(--border);
	color: var(--text-muted);
}

sl-button:hover::part(base),
sl-button:focus-within::part(base),
sl-button:active::part(base) {
	background: var(--surface-hover);
	border-color: var(--border);
	color: var(--text);
}

sl-menu-item::part(base) {
	color: var(--text-muted);
}

sl-menu-item:hover::part(base),
sl-menu-item:focus-visible::part(base) {
	background: var(--surface-hover);
	color: var(--text);
}

sl-input::part(base) {
	border-color: var(--border);
	color: var(--text);
}

sl-input:hover::part(base),
sl-input:focus-within::part(base) {
	background: var(--surface);
	border-color: var(--border);
	box-shadow: 0 0 0 1px var(--surface-hover);
	color: var(--text);
}

}`
