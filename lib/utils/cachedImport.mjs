import MemoryCache from './MemoryCache.mjs';
import dynamicImport from './dynamicImport.mjs';

/** @type {MemoryCache<Promise<any>>} */
const moduleCache = new MemoryCache();

/**
 * Cached dynamic import - stores the Promise to avoid repeated resolution.
 *
 * While Node.js caches ES modules, we can avoid repeated async overhead by
 * caching the Promise itself.
 *
 * @param {string} modulePath
 * @returns {Promise<any>}
 */
export default function cachedImport(modulePath) {
	const cached = moduleCache.get(modulePath);

	if (cached) {
		return cached;
	}

	const importPromise = dynamicImport(modulePath).catch((error) => {
		// Remove failed imports from cache so they can be retried.
		moduleCache.delete(modulePath);
		throw error;
	});

	moduleCache.set(modulePath, importPromise);

	return importPromise;
}

/**
 * Clear the module cache. Useful for testing or when modules need to be
 * reloaded.
 */
export function clearModuleCache() {
	moduleCache.clear();
}
