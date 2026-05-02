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

		resolved = await dynamicImport(loader, { moduleLabel: 'loader' });
		resolved = resolved.default ?? resolved;

		return resolved;
	}

	if (typeof loader === 'object' || typeof loader === 'function') {
		return loader;
	}

	throw new Error('Loader must be a string or a PostCSS plugin');
}
