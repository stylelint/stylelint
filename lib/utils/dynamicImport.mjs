import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Dynamic import wrapper for compatibility with absolute paths on Windows
 *
 * @see https://github.com/stylelint/stylelint/issues/7382
 *
 * @param {string} path
 * @param {object} [options]
 * @param {string} [options.moduleLabel]
 * @returns {Promise<any>}
 */
export default async function dynamicImport(path, { moduleLabel } = {}) {
	const resolvedPath = isAbsolute(path) ? pathToFileURL(path).toString() : path;

	return import(resolvedPath).catch((e) => {
		if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_MODULE_NOT_FOUND') {
			const label = moduleLabel ? `${moduleLabel} ` : '';

			throw new Error(
				`Cannot resolve ${label}module "${path}". Check that module "${path}" is available and spelled correctly`,
			);
		}

		throw e;
	});
}
