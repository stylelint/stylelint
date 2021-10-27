'use strict';

const isStandardSyntaxFunction = require('./isStandardSyntaxFunction');
const { isValueFunction } = require('./typeGuards');

/**
 * Check whether a function is standard syntax color function
 *
 * @param {import('postcss-value-parser').Node} node
 * @returns { node is import('postcss-value-parser').FunctionNode }
 */
module.exports = function isStandardSyntaxColorFunction(node) {
	if (!isValueFunction(node)) return false;

	if (!isStandardSyntaxFunction(node)) return false;

	// scss rgba() function can accept a hex as the first param
	for (const fnNode of node.nodes) {
		if (fnNode.type === 'word' && fnNode.value.startsWith('#')) return false;
	}

	return true;
};
