/* @flow */
'use strict';

/**
 * Check whether a media feature name is standard
 *
 * @param {string} mediaFeatureName
 * @returns {boolean}
 */
module.exports = function(mediaFeatureName /*: string*/) /*: boolean*/ {
	// SCSS interpolation
	if (/#{.+?}|\$.+?/.test(mediaFeatureName)) {
		return false;
	}

	return true;
};
