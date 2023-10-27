// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

const hasInterpolation = require('./hasInterpolation.cjs');

/**
 * Check whether a keyframes name is standard
 *
 * @param {string} keyframesName
 * @returns {boolean}
 */
function isStandardSyntaxKeyframesName(keyframesName) {
	if (hasInterpolation(keyframesName)) {
		return false;
	}

	return true;
}

module.exports = isStandardSyntaxKeyframesName;
