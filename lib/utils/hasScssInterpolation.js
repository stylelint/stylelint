/* @flow */
'use strict';

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
module.exports = function(string /*: string*/) /*: boolean*/ {
	return /#{.+?}/.test(string);
};
