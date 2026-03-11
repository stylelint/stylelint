import fs from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import process from 'node:process';

import { fileURLToPath, pathToFileURL } from 'node:url';

// TODO: refactor to use `import.meta.resolve()` when the `parent` argument
// is available without the --experimental-import-meta-resolve flag
// @see https://github.com/stylelint/stylelint/pull/8886
import { resolve } from 'import-meta-resolve';

/**
 * @typedef {object} PnpApi
 * @property {(specifier: string, issuer: string | null) => string | null} resolveRequest
 * @property {(specifier: string, issuer: string | null) => string | null} resolveToUnqualified
 */

/**
 * @typedef {typeof module & { findPnpApi?: (issuer: string) => PnpApi | null }} ModuleWithPnp
 */

/**
 * Attempts to resolve a module specifier using Yarn PnP's API.
 *
 * When running under Yarn PnP, the import-meta-resolve polyfill doesn't work
 * because it bypasses PnP's virtual filesystem. This function uses
 * Module.findPnpApi() to get the PnP API for the target directory and
 * resolves packages through it.
 *
 * @see https://yarnpkg.com/advanced/pnpapi
 * @see https://github.com/stylelint/stylelint/issues/8971
 * @param {string} specifier The module specifier to resolve.
 * @param {string} issuer The directory to resolve from. Must end with /.
 * @returns {string | undefined} The resolved path, or undefined if resolution fails.
 */
function resolvePnP(specifier, issuer) {
	// Module.findPnpApi is added by Yarn PnP at runtime.
	const mod = /** @type {ModuleWithPnp} */ (module);

	if (typeof mod.findPnpApi !== 'function') {
		return undefined;
	}

	const pnpapi = mod.findPnpApi(issuer);

	if (!pnpapi) {
		return undefined;
	}

	try {
		// First try resolveRequest.
		return pnpapi.resolveRequest(specifier, issuer) ?? undefined;
	} catch {
		// resolveRequest can fail for packages with only exports field. Fall
		// back to resolveToUnqualified to locate the package, then use import-
		// meta-resolve to handle the exports field resolution correctly.
		try {
			const packagePath = pnpapi.resolveToUnqualified(specifier, issuer);

			if (!packagePath) {
				return undefined;
			}

			// Use import-meta-resolve from the package's location to resolve
			// its entry point.
			const packageBase = pathToFileURL(path.join(packagePath, 'noop.js')).toString();
			const resolved = resolve(specifier, packageBase);

			return fileURLToPath(resolved);
		} catch {
			return undefined;
		}
	}
}

// TODO: Remove support for CommonJS-style filename-less and extension-less paths in the
// next major release to align with ESM import behavior.
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

	// In Yarn PnP environments, try PnP resolution first for bare specifiers.
	// The import-meta-resolve polyfill doesn't work with PnP because it
	// bypasses the virtual filesystem.
	const isBareSpecifier = !lookup.startsWith('./') && !lookup.startsWith('../');

	if (isBareSpecifier && process.versions.pnp) {
		const issuer = path.resolve(parent) + path.sep;

		// Try with suffixes for CommonJS compatibility.
		for (const suffix of specifierSuffixes) {
			const resolved = resolvePnP(lookup + suffix, issuer);

			if (resolved && existsFile(resolved)) {
				return resolved;
			}
		}
	}

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

	return undefined;
}
