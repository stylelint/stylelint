'use strict';

const HAS_PSV_INTERPOLATION = /\$\(.+?\)/;

/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 * @returns {boolean}
 */
function hasPsvInterpolation(string) {
	return HAS_PSV_INTERPOLATION.test(string);
}

module.exports = hasPsvInterpolation;
