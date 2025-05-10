import {signal} from '@benev/slate'

export class TreeNavigator {
	readonly path = signal<(string|null)[]>([null])

	constructor() {}

	enter = (path: (string|null)[]) => {
		this.path.value = path
	}

}
