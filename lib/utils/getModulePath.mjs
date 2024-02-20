import path from 'node:path';
import process from 'node:process';

import { fileURLToPath, pathToFileURL } from 'node:url';

import globalModules from 'global-modules';
import { resolve } from 'import-meta-resolve';

import configurationError from './configurationError.mjs';

/**
 * @param {string} parent
 * @param {string} lookup
 * @return {string | undefined}
 */
const resolveSilent = (parent, lookup) => {
	try {
		return fileURLToPath(
			resolve(lookup, pathToFileURL(path.resolve(parent, 'noop.js')).toString()),
		);
	} catch {
		//
	}
};

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
	let modulePath = resolveSilent(basedir, lookup);

	if (!modulePath) {
		modulePath = resolveSilent(cwd, lookup);
	}

	if (!modulePath) {
		modulePath = resolveSilent(globalModules, lookup);
	}

	if (!modulePath) {
		throw configurationError(
			`Could not find "${lookup}". Do you need to install the package or use the "configBasedir" option?`,
		);
	}

	return modulePath;
}
