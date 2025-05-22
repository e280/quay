enum PermissionKey {
	rename = "rename",
	move = "move",
	delete = "delete",
	refresh = "refresh",
	newFolder = "newFolder",
	search = "search",
	upload = "upload"
}

export type Permission = {
	[K in PermissionKey]: boolean
}

const ALL_KEYS = Object.values(PermissionKey) as PermissionKey[]

function makePermissions(
	defaultValue: boolean,
	overrides: Partial<Permission> = {}
): Permission {
	const perms = {} as Permission
	for (const key of ALL_KEYS)
		perms[key] = key in overrides ? overrides[key]! : defaultValue
	return perms
}

export const Permissions = {
	all: makePermissions(true),
	readOnly: makePermissions(false, {
		[PermissionKey.refresh]: true,
		[PermissionKey.search]: true,
	}),
	none: makePermissions(false),
}
