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

		resolved = await dynamicImport(customSyntax, { moduleLabel: 'custom syntax' });
		resolved = resolved.default ?? resolved;

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
