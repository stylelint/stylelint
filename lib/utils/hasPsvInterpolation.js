/* @flow */
'use strict';

/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 */
module.exports = function(string /*: string*/) /*: boolean*/ {
	return /\$\(.+?\)/.test(string);
};
