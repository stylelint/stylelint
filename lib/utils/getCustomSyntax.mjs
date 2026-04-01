import postcss from 'postcss';

import dynamicImport from './dynamicImport.mjs';

/** @import {Syntax} from 'postcss' */
/** @import {CustomSyntax} from 'stylelint' */

/**
 * @param {CustomSyntax} customSyntax
 * @returns {Promise<Syntax>}
 */
export default async function getCustomSyntax(customSyntax) {
	if (typeof customSyntax === 'string') {
		let resolved;

		try {
			resolved = await dynamicImport(customSyntax);
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
				error.message.includes(customSyntax)
			) {
				throw new Error(
					`Cannot resolve custom syntax module "${customSyntax}". Check that module "${customSyntax}" is available and spelled correctly.\n\nCaused by: ${error}`,
					{ cause: error },
				);
			}

			throw error;
		}

		/*
		 * PostCSS allows for syntaxes that only contain a parser, however,
		 * it then expects the syntax to be set as the `parse` option.
		 */
		if (!resolved.parse) {
			resolved = {
				parse: resolved,
				stringify: postcss.stringify,
			};
		}

		return resolved;
	}

	if (typeof customSyntax === 'object' || typeof customSyntax === 'function') {
		if (typeof customSyntax.parse === 'function') {
			return { ...customSyntax };
		}

		throw new TypeError(
			'An object provided to the "customSyntax" option must have a "parse" property. Ensure the "parse" property exists and its value is a function.',
		);
	}

	throw new Error('Custom syntax must be a string or a Syntax object');
}
