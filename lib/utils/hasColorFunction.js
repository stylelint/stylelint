'use strict';

const HAS_COLOR_FUNCTION = /(?:^|[^\w-])(?:rgba?|hsla?|color|hwb|lab|oklab|lch|oklch|color-mix)\(/i;

/**
 * Check if a value contains any standard CSS color function
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function hasColorFunction(value) {
	return HAS_COLOR_FUNCTION.test(value);
};
