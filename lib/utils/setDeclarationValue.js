'use strict';

/** @typedef {import('postcss').Declaration} Declaration */

/**
 * @param {Declaration} decl
 * @param {string} value
 * @returns {Declaration} The declaration that was passed in.
 */
module.exports = function setDeclarationValue(decl, value) {
	// Casting this to any because 'value' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = decl.raws;

	if (raws.value) {
		raws.value.raw = value;
	} else {
		decl.value = value;
	}

	return decl;
};
