import {signal} from '@benev/slate'
import {MediaSchema} from './types.js'
import {CodexItem} from './codex/parts/codex-item.js'

export class TreeSearch {
	readonly query = signal('')

	matches(item: CodexItem<MediaSchema>): boolean {
		const q = this.query.value.trim().toLowerCase()

		if (q === '')
			return true

		if (item.kind === 'folder') {
			return item.children.some(child => this.matches(child))
		}

		return item.specimen.label.toLowerCase().includes(q)
	}
}
