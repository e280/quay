export type ItemType = 'video' | 'image' | 'audio' | 'folder'

export interface TreeItem {
	id: string
	name: string
	type: ItemType
	parentId: string | null
	createdAt: number
	sortIndex: number
}

export type NestedTreeItem = TreeItem & {
	children?: NestedTreeItem[]
}
