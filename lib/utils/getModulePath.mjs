import process from 'node:process';

import globalModules from 'global-modules';

import { ConfigurationError } from './errors.mjs';
import MemoryCache from './MemoryCache.mjs';
import resolveSilent from './resolveSilent.mjs';

/** @type {MemoryCache<string>} */
const modulePathCache = new MemoryCache();

/**
 * @param {string} basedir
 * @param {string} lookup
 * @param {string} [cwd]
 * @returns {string}
 */
export default function getModulePath(basedir, lookup, cwd = process.cwd()) {
	const cacheKey = `${basedir}\0${lookup}\0${cwd}`;
	const cached = modulePathCache.get(cacheKey);

	if (cached) return cached;

	// 1. Try to resolve from the provided directory
	// 2. Try to resolve from `cwd` or `process.cwd()`
	// 3. Try to resolve from global `node_modules` directory
	let path = resolveSilent(basedir, lookup);

	if (!path) {
		path = resolveSilent(cwd, lookup);
	}

	if (!path) {
		path = resolveSilent(globalModules, lookup);
	}

	if (!path) {
		throw new ConfigurationError(
			`Could not find "${lookup}". Do you need to install the package or use the "configBasedir" option?`,
		);
	}

	modulePathCache.set(cacheKey, path);

	return path;
}

// Exported for testing
export function clearModulePathCache() {
	modulePathCache.clear();
}
