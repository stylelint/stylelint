'use strict';

const IS_COLOR_FUNCTION = /^(?:rgba?|hsla?|color|hwb|lab|oklab|lch|oklch|color-mix)$/i;

/**
 * Check if a value is any standard CSS color function
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function isColorFunction(value) {
	return IS_COLOR_FUNCTION.test(value);
};
