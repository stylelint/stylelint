'use strict';

/**
 * Check whether a combinator is standard
 *
 * @param {import('postcss-selector-parser').Combinator} node postcss-selector-parser node (of type combinator)
 * @return {boolean} If `true`, the combinator is standard
 */
module.exports = function (node) {
	// Ignore reference combinators like `/deep/`
	return node.type === 'combinator' && !node.value.startsWith('/') && !node.value.endsWith('/');
};
