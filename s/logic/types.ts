export type ItemType = 'video' | 'image' | 'audio' | 'folder'

type TreeItemBase = {
	id: string
	name: string
	type: ItemType
	createdAt: number
	sortIndex: number
}

export type TreeItem = TreeItemBase & {
	parentId: string | null
}

export type NestedTreeItem = TreeItemBase & {
	children: NestedTreeItem[]
}
