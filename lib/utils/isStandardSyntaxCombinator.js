'use strict';

/**
 * Check whether a combinator is standard
 *
 * @param {import('postcss-selector-parser').Combinator} node postcss-selector-parser node (of type combinator)
 * @return {boolean} If `true`, the combinator is standard
 */
module.exports = function (node) {
	// if it's not a combinator, then it's not a standard combinator
	if (node.type !== 'combinator') {
		return false;
	}

	// Ignore reference combinators like `/deep/`
	if (node.value.startsWith('/') || node.value.endsWith('/')) {
		return false;
	}

	// first node in container
	// TODO

	// last node in container
	// TODO

	return true;
};
