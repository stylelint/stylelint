'use strict';

const isStandardSyntaxFunction = require('./isStandardSyntaxFunction');

/**
 * Check whether a function is standard syntax color function
 *
 * @param {import('postcss-value-parser').FunctionNode} node
 * @returns {boolean}
 */
module.exports = function isStandardSyntaxColorFunction(node) {
	if (!isStandardSyntaxFunction(node)) return false;

	// scss rgba() function can accept a hex as the first param
	for (const fnNode of node.nodes) {
		if (fnNode.type === 'word' && fnNode.value.startsWith('#')) return false;
	}

	return true;
};
