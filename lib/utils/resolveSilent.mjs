import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

// TODO: use pure ESM `import-meta-resolve` package in next major version
import { moduleResolve } from '@dual-bundle/import-meta-resolve';
import resolveFrom from 'resolve-from';

/**
 * TODO: These suffixes are here for commonjs compatibility reason, we should remove these codes after migrating to pure ESM, because in ESM accurate paths are required
 */

const pathSuffixes = ['', '.js', '.json', `${path.sep}index.js`, `${path.sep}index.json`];

const specifierSuffixes = ['', '.js', '.json', '/index.js', '/index.json'];

/**
 * @param {string} parent
 * @param {string} lookup
 * @return {string | undefined}
 */
export default function resolveSilent(parent, lookup) {
	if (path.isAbsolute(lookup)) {
		for (const suffix of pathSuffixes) {
			const filename = lookup + suffix;

			if (fs.existsSync(filename)) {
				return filename;
			}
		}

		return;
	}

	const base = pathToFileURL(path.resolve(parent, 'noop.js'));

	for (const suffix of specifierSuffixes) {
		try {
			return fileURLToPath(moduleResolve(lookup + suffix, base));
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
