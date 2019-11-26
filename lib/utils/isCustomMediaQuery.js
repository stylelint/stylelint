/* @flow */
'use strict';

/**
 * Check whether a media query is a custom
 * @param {string} mediaQuery
 * @returns {boolean}
 */
module.exports = function(mediaQuery /*: string*/) /*: boolean*/ {
	return mediaQuery.slice(0, 2) === '--';
};
