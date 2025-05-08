import {signal} from '@benev/slate'

export class TreeSearch {
	readonly query = signal('')

	matches(name: string) {
		const q = this.query.value.trim().toLowerCase()
		return q === '' || name.toLowerCase().includes(q)
	}
}
