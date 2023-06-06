'use strict';

const { isAtRule } = require('./typeGuards');

const IS_UNICODE_RANGE = /^unicode-range$/i;
const IS_AT_FONT_FACE = /^font-face$/i;

/**
 * Check whether a declaration is the `unicode-range` descriptor of an `@font-face` rule.
 *
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
module.exports = function isUnicodeRangeDescriptor(decl) {
	if (!IS_UNICODE_RANGE.test(decl.prop)) {
		return false;
	}

	const parent = decl.parent;

	if (!parent || !isAtRule(parent)) {
		return false;
	}

	return IS_AT_FONT_FACE.test(parent.name);
};
