import dynamicImport from './dynamicImport.mjs';

/** Maximum number of modules to cache to prevent unbounded memory growth. */
const MAX_CACHE_SIZE = 1000;

/** Time-to-live in milliseconds. Exported for tests. */
export const TTL_MS = 30 * 60 * 1000;

/**
 * @typedef {Object} CacheEntry
 * @property {Promise<any>} promise
 * @property {number} timestamp
 */

/** @type {Map<string, CacheEntry>} */
const moduleCache = new Map();

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
		// Check if entry has expired.
		if (Date.now() - cached.timestamp > TTL_MS) {
			moduleCache.delete(modulePath);
		} else {
			return cached.promise;
		}
	}

	const importPromise = dynamicImport(modulePath).catch((error) => {
		// Remove failed imports from cache so they can be retried.
		moduleCache.delete(modulePath);
		throw error;
	});

	// Evict oldest entry if cache is full.
	if (moduleCache.size >= MAX_CACHE_SIZE) {
		const oldestKey = moduleCache.keys().next().value;

		if (oldestKey) {
			moduleCache.delete(oldestKey);
		}
	}

	moduleCache.set(modulePath, {
		promise: importPromise,
		timestamp: Date.now(),
	});

	return importPromise;
}

/**
 * Clear the module cache. Useful for testing or when modules need to be
 * reloaded.
 */
export function clearModuleCache() {
	moduleCache.clear();
}
