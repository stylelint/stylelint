'use strict';

const hasLessInterpolation = require('../utils/hasLessInterpolation.cjs');
const hasPsvInterpolation = require('../utils/hasPsvInterpolation.cjs');
const hasScssInterpolation = require('../utils/hasScssInterpolation.cjs');
const hasTplInterpolation = require('../utils/hasTplInterpolation.cjs');

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
module.exports = function hasInterpolation(string) {
	// SCSS or Less interpolation
	if (
		hasLessInterpolation(string) ||
		hasScssInterpolation(string) ||
		hasTplInterpolation(string) ||
		hasPsvInterpolation(string)
	) {
		return true;
	}

	return false;
};
