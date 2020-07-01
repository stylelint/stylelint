'use strict';

const hasInterpolation = require('../utils/hasInterpolation');
const punctuationSets = require('../reference/punctuationSets');

/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @returns {boolean}
 */
module.exports = function (selector) {
	// SCSS or Less interpolation
	if (hasInterpolation(selector)) {
		return false;
	}

	// SCSS placeholder selectors
	if (selector.startsWith('%')) {
		return false;
	}

	// trailing combinators
	for (let combinator of punctuationSets.nonSpaceCombinators) {
		if (selector.includes(`${combinator},`)) {
			return false;
		}
	}

	// Less :extend()
	if (/:extend(\(.*?\))?/.test(selector)) {
		return false;
	}

	// Less mixin with resolved nested selectors (e.g. .foo().bar or .foo(@a, @b)[bar])
	if (/\.[\w-]+\(.*\).+/i.test(selector)) {
		return false;
	}

	// ERB template tags
	if (selector.includes('<%') || selector.includes('%>')) {
		return false;
	}

	return true;
};
