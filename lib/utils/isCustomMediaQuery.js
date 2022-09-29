'use strict';

/**
 * Check whether a media query is a custom
 * @param {string} mediaQuery
 * @returns {boolean}
 */
module.exports = function isCustomMediaQuery(mediaQuery) {
	return mediaQuery.startsWith('--');
};
