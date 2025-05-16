export function findGroupName(el: HTMLElement) {
	for (
		let current: HTMLElement | null = el;
		current;
		current = current.parentElement
	) {
		const group = current.getAttribute("group")
		if (group)
			return group
	}
	return "default"
}
