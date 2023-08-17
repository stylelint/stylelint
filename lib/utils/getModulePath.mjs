import process from 'node:process';

import globalModules from 'global-modules';
import resolveFrom from 'resolve-from';

import configurationError from './configurationError.mjs';

/**
 * @param {string} basedir
 * @param {string} lookup
 * @param {string} [cwd]
 * @return {string}
 */
export default function getModulePath(basedir, lookup, cwd = process.cwd()) {
	// 1. Try to resolve from the provided directory
	// 2. Try to resolve from `cwd` or `process.cwd()`
	// 3. Try to resolve from global `node_modules` directory
	let path = resolveFrom.silent(basedir, lookup);

	if (!path) {
		path = resolveFrom.silent(cwd, lookup);
	}

	if (!path) {
		path = resolveFrom.silent(globalModules, lookup);
	}

	if (!path) {
		throw configurationError(
			`Could not find "${lookup}". Do you need the "configBasedir" or "--config-basedir" option?`,
		);
	}

	return path;
}
