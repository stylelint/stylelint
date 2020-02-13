'use strict';

/**
 * Check whether a combinator is standard
 *
 * @param {import('postcss-selector-parser').Combinator} node postcss-selector-parser node (of type combinator)
 * @return {boolean} If `true`, the combinator is standard
 */
module.exports = function(node) {
	// Ghost descendant combinators around reference combinators like `/deep/`
	// postcss-selector-parser parsers references combinators as tag selectors surrounded
	// by descendant combinators
	return node.type === 'combinator' && !node.value.startsWith('/') && !node.value.endsWith('/');
};
