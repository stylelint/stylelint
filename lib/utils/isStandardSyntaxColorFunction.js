'use strict';

const isStandardSyntaxFunction = require('./isStandardSyntaxFunction');
const isValidHex = require('./isValidHex');

/**
 * Check whether a function is standard syntax color function
 *
 * @param {import('postcss-value-parser').Node} node
 * @returns { node is import('postcss-value-parser').FunctionNode }
 */
module.exports = function (node) {
	if (node.type !== 'function') return false;

	if (!isStandardSyntaxFunction(node)) return false;

	// scss rgba() function can accept a hex as the first param
	for (const [, fnNode] of node.nodes.entries()) {
		if (fnNode.type === 'word') {
			if (isValidHex(fnNode.value)) return false;

			break;
		}
	}

	return true;
};
