export type ItemType = 'video' | 'image' | 'audio' | string

type TreeItemBase = {
	id: string
	name: string
	createdAt: number
	sortIndex: number
	allowChildren: boolean
	meta?: {
		type?: ItemType
	}
}

export type TreeItem = TreeItemBase & {
	parentId: string | null
}

export type NestedTreeItem = TreeItemBase & {
	children: NestedTreeItem[]
}

export interface QuaySchema<Item = any> {
	getLabel(item: Item): string
	getIcon(item: Item, open?: boolean): string
	isFolder(item: Item): boolean
	isVisible?(item: Item): boolean
}
