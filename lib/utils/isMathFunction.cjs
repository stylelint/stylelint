'use strict';

const functions = require('../reference/functions.cjs');

/**
 * Check whether a node is math function
 *
 * @param {import('postcss-value-parser').Node} node postcss-value-parser node
 * @return {boolean} If `true`, the node is math function
 */
function isMathFunction(node) {
	return node.type === 'function' && functions.mathFunctions.has(node.value.toLowerCase());
}

module.exports = isMathFunction;
