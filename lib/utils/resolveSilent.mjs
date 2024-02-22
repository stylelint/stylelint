import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath, pathToFileURL } from 'node:url';

import { moduleResolve } from 'import-meta-resolve';

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

	const resolvedParent = pathToFileURL(path.resolve(parent, 'noop.js'));

	for (const suffix of specifierSuffixes) {
		try {
			return fileURLToPath(moduleResolve(lookup + suffix, resolvedParent));
		} catch {
			//
		}
	}
}
