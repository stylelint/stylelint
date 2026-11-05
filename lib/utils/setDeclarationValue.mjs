/** @import { Declaration } from 'postcss' */

import cleanRaws from './cleanRaws.mjs';

/**
 * @param {Declaration} decl
 * @param {string} value
 * @returns {Declaration} The declaration that was passed in.
 */
export default function setDeclarationValue(decl, value) {
	const raws = decl.raws;

	if (raws.value) {
		decl.value = cleanRaws(value, decl.variable);
		raws.value.value = decl.value;
		raws.value.raw = value;
	} else {
		decl.value = value;
	}

	return decl;
}
