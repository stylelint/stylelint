'use strict';

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
module.exports = function hasScssInterpolation(string) {
	return /#\{.+?\}/.test(string);
};
