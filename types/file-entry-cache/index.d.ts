declare module 'file-entry-cache' {
	type Cache = any; // TODO TYPES

	export function create(file: string): Cache;
}
