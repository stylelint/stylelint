// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const hasLessInterpolation = require('./hasLessInterpolation.cjs');
const hasPsvInterpolation = require('./hasPsvInterpolation.cjs');
const hasScssInterpolation = require('./hasScssInterpolation.cjs');
const hasTplInterpolation = require('./hasTplInterpolation.cjs');

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @returns {boolean} If `true`, a string has interpolation
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
