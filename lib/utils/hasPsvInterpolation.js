'use strict';

/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 */
module.exports = function hasPsvInterpolation(string) {
	return /\$\(.+?\)/.test(string);
};
