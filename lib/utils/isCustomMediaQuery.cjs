'use strict';

/**
 * Check whether a media query is a custom
 * @param {string} mediaQuery
 * @returns {boolean}
 */
function isCustomMediaQuery(mediaQuery) {
	return mediaQuery.startsWith('--');
}

module.exports = isCustomMediaQuery;
