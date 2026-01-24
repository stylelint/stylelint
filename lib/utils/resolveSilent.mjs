import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { createRequire } from 'node:module';

import { fileURLToPath, pathToFileURL } from 'node:url';

// TODO: refactor to only use `import.meta.resolve()` when the `parent` argument
// is available without the --experimental-import-meta-resolve flag
// @see https://github.com/stylelint/stylelint/pull/8886
import { resolve as resolvePolyfill } from 'import-meta-resolve';

/**
 * Checks if the --experimental-import-meta-resolve flag is enabled. This flag
 * enables the parentURL parameter for import.meta.resolve(). The flag can be
 * passed directly to Node.js or via NODE_OPTIONS.
 *
 * @see https://nodejs.org/docs/latest-v20.x/api/esm.html#importmetaresolvespecifier
 * @returns {boolean}
 */
function hasExperimentalImportMetaResolve() {
	const flag = '--experimental-import-meta-resolve';

	return process.execArgv.includes(flag) || (process.env.NODE_OPTIONS?.includes(flag) ?? false);
}

/**
 * Resolves a module specifier using either native import.meta.resolve when
 * --experimental-import-meta-resolve is enabled, or the import-meta-resolve
 * polyfill.
 *
 * Native import.meta.resolve properly integrates with Yarn PnP and other
 * loaders.
 *
 * @see https://github.com/stylelint/stylelint/issues/8971
 * @param {string} specifier
 * @param {string} parent
 * @returns {string}
 */
const resolve = hasExperimentalImportMetaResolve()
	? /* istanbul ignore next -- requires --experimental-import-meta-resolve flag */ (
			/** @type {string} */ specifier,
			/** @type {string | import("url").URL | undefined} */ parent,
		) => import.meta.resolve(specifier, parent)
	: resolvePolyfill;

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

	// Try ESM resolution with suffixes for CommonJS compatibility.
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
	 * The import-meta-resolve polyfill does not respect loaders or environment
	 * variables during resolution, which can lead to failed resolutions when
	 * using Yarn PnP.
	 *
	 * To work around this, we fall back to CommonJS resolution via
	 * createRequire. Only bare specifiers, such as 'stylelint-config-standard',
	 * are resolved this way. Relative paths, e.g. './config.js', are excluded
	 * because they work correctly with ESM resolution and allowing CommonJS
	 * fallback for them could resolve from unintended locations.
	 *
	 * @see https://github.com/wooorm/import-meta-resolve/issues/23
	 * @see https://github.com/stylelint/stylelint/issues/8971
	 */
	const isBareSpecifier = !lookup.startsWith('./') && !lookup.startsWith('../');

	if (isBareSpecifier) {
		try {
			const require = createRequire(pathToFileURL(path.resolve(parent, 'noop.js')));

			return require.resolve(lookup);
		} catch {
			// CJS resolution failed
		}
	}

	return undefined;
}
