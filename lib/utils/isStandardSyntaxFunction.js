'use strict';

/**
 * Check whether a function is standard
 *
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
module.exports = function isStandardSyntaxFunction(node) {
	// Function nodes without names are things in parentheses like Sass lists
	if (!node.value) {
		return false;
	}

	if (node.value.startsWith('#{')) {
		return false;
	}

	// CSS-in-JS interpolation
	if (node.value.startsWith('${')) {
		return false;
	}

	// CSS-in-JS syntax
	if (node.value.startsWith('`')) {
		return false;
	}

	return true;
};
