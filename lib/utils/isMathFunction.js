/* @flow */
'use strict';

const MATH_FUNCTIONS = require('../reference/mathFunctions');

/**
 * Check whether a node is math function
 *
 * @param {Node} postcss-value-parser node
 * @return {boolean} If `true`, the node is math function
 */
module.exports = function isMathFunction(node /*: Object */) /*: boolean*/ {
	return node.type === 'function' && MATH_FUNCTIONS.includes(node.value.toLowerCase());
};
