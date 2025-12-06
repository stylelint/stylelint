import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

// TODO: refactor to use `import.meta.resolve()` when the `parent` argument
// is available without the --experimental-import-meta-resolve flag
// @see https://github.com/stylelint/stylelint/pull/8886
import { resolve } from 'import-meta-resolve';

/**
 * TODO: These suffixes are here for commonjs compatibility reason, we should remove
 * these codes after migrating to pure ESM, because in ESM accurate paths are required
 */

const pathSuffixes = ['', '.js', '.json', `${path.sep}index.js`, `${path.sep}index.json`];

const specifierSuffixes = ['', '.js', '.json', '/index.js', '/index.json'];

/**
 * Checks whether the given file exists as a file.
 * @param {string} filename The file to check.
 * @returns {boolean} `true` if the file exists and is a file, otherwise `false`.
 */
function existsFile(filename) {
	return fs.statSync(filename, { throwIfNoEntry: false })?.isFile() ?? false;
}

/**
 * @param {string} parent
 * @param {string} lookup
 * @returns {string | undefined}
 */
export default function resolveSilent(parent, lookup) {
	if (path.isAbsolute(lookup)) {
		for (const suffix of pathSuffixes) {
			const filename = lookup + suffix;

			if (existsFile(filename)) {
				return filename;
			}
		}

		return;
	}

	const base = pathToFileURL(path.resolve(parent, 'noop.js')).toString();

	for (const suffix of specifierSuffixes) {
		try {
			const resolved = fileURLToPath(resolve(lookup + suffix, base));

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
	 * TODO: remove workaround after native `import.meta.resolve()` replacement
	 */
	try {
		return resolve(lookup, parent);
	} catch {
		return undefined;
	}
}
