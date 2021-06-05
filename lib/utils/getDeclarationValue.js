'use strict';

/**
 * @param {import('postcss').Declaration} decl
 * @returns {string}
 */
module.exports = function getDeclarationValue(decl) {
	// Casting this to any because 'value' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = decl.raws;

	return (raws.value && raws.value.raw) || decl.value;
};
