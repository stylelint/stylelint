'use strict';

const HAS_SCSS_INTERPOLATION = /#\{.+?\}/;

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
module.exports = function hasScssInterpolation(string) {
	return HAS_SCSS_INTERPOLATION.test(string);
};
