'use strict';

const hasLessInterpolation = require('./hasLessInterpolation.cjs');
const hasPsvInterpolation = require('./hasPsvInterpolation.cjs');
const hasScssInterpolation = require('./hasScssInterpolation.cjs');
const hasTplInterpolation = require('./hasTplInterpolation.cjs');

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
function hasInterpolation(string) {
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
}

module.exports = hasInterpolation;