// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const node_url = require('node:url');
const importMetaResolve = require('@dual-bundle/import-meta-resolve');
const resolveFrom = require('resolve-from');

/**
 * TODO: These suffixes are here for commonjs compatibility reason, we should remove these codes after migrating to pure ESM, because in ESM accurate paths are required
 */

const pathSuffixes = ['', '.js', '.json', `${path.sep}index.js`, `${path.sep}index.json`];

const specifierSuffixes = ['', '.js', '.json', '/index.js', '/index.json'];

/**
 * Checks whether the given file exists as a file.
 * @param {string} filename The file to check.
 * @returns {boolean} `true` if the file exists and is a file, otherwise `false`.
 */
function existsFile(filename) {
	return fs.existsSync(filename) && fs.statSync(filename).isFile();
}

/**
 * @param {string} parent
 * @param {string} lookup
 * @return {string | undefined}
 */
function resolveSilent(parent, lookup) {
	if (path.isAbsolute(lookup)) {
		for (const suffix of pathSuffixes) {
			const filename = lookup + suffix;

			if (existsFile(filename)) {
				return filename;
			}
		}

		return;
	}

	const base = node_url.pathToFileURL(path.resolve(parent, 'noop.js')).toString();

	for (const suffix of specifierSuffixes) {
		try {
			const resolved = node_url.fileURLToPath(importMetaResolve.resolve(lookup + suffix, base));

			if (existsFile(resolved)) {
				return resolved;
			}
		} catch {
			//
		}
	}

	/**
	 * Yarn P'n'P does not support pure ESM well by default, this is only a workaround for it
	 * @see https://github.com/wooorm/import-meta-resolve/issues/23
	 *
	 * TODO: this workaround is still necessary before native `import.meta.resolve` replacement
	 */
	return resolveFrom.silent(parent, lookup);
}

module.exports = resolveSilent;
