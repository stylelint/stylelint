import dynamicImport from './dynamicImport.mjs';

/** @import {Plugin,PluginCreator} from 'postcss' */
/** @import {Loader} from 'stylelint' */

/**
 * @param {Loader} loader
 * @returns {Promise<Plugin|PluginCreator<unknown>>}
 */
export default async function getLoader(loader) {
	if (typeof loader === 'string') {
		let resolved;

		try {
			resolved = await dynamicImport(loader);
			resolved = resolved.default ?? resolved;
		} catch (error) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				// TODO: Remove 'MODULE_NOT_FOUND' when we drop the CommonJS support.
				// See https://nodejs.org/api/errors.html#module_not_found
				(error.code === 'MODULE_NOT_FOUND' || error.code === 'ERR_MODULE_NOT_FOUND') &&
				'message' in error &&
				typeof error.message === 'string' &&
				error.message.includes(loader)
			) {
				throw new Error(
					`Cannot resolve loader module "${loader}". Check that module "${loader}" is available and spelled correctly.\n\nCaused by: ${error}`,
					{ cause: error },
				);
			}

			throw error;
		}

		return resolved;
	}

	if (typeof loader === 'object' || typeof loader === 'function') {
		return loader;
	}

	throw new Error('Loader must be a string or a PostCSS plugin');
}
