'use strict';

/**
 * @param {import('postcss').Declaration} decl
 * @returns {string}
 */
module.exports = function getDeclarationValue(decl) {
	const raws = decl.raws;

	return (raws.value && raws.value.raw) || decl.value;
};
