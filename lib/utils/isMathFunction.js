'use strict';

const { mathFunctions } = require('../reference/functions');

/**
 * Check whether a node is math function
 *
 * @param {import('postcss-value-parser').Node} node postcss-value-parser node
 * @return {boolean} If `true`, the node is math function
 */
module.exports = function isMathFunction(node) {
	return node.type === 'function' && mathFunctions.has(node.value.toLowerCase());
};
