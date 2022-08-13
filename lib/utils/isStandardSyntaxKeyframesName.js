'use strict';

const hasInterpolation = require('./hasInterpolation');

/**
 * Check whether a keyframes name is standard
 *
 * @param {string} keyframesName
 * @returns {boolean}
 */

module.exports = function (keyframesName) {
	// SCSS or Less interpolation
	if (hasInterpolation(keyframesName)) {
		return false;
	}

	return true;
};
