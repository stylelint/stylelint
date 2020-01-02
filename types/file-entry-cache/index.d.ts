declare module 'file-entry-cache' {
	type CacheEntry = any; // TODO TYPES

	export function create(file: string): CacheEntry;
}
