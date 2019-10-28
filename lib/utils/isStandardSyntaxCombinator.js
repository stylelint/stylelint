/* @flow */
'use strict';

const _ = require('lodash');

/**
 * Check whether a combinator is standard
 *
 * @param {import('postcss-selector-parser').Combinator} node postcss-selector-parser node (of type combinator)
 * @return {boolean} If `true`, the combinator is standard
 */
module.exports = function(node /*: Object*/) /*: boolean*/ {
	// Ghost descendant combinators around reference combinators like `/deep/`
	// postcss-selector-parser parsers references combinators as tag selectors surrounded
	// by descendant combinators
	if (
		(node.prev() &&
			node.prev().type === 'tag' &&
			_.startsWith(node.prev().value, '/') &&
			_.endsWith(node.prev().value, '/')) ||
		(node.next() &&
			node.next().type === 'tag' &&
			_.startsWith(node.next().value, '/') &&
			_.endsWith(node.next().value, '/'))
	) {
		return false;
	}

	return true;
};
