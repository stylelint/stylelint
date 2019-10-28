/* @flow */
'use strict';

/**
 * Check if a character is whitespace.
 *
 * @param {string} char
 * @returns {boolean}
 */
module.exports = function(char /*: string*/) /*: boolean*/ {
	return [' ', '\n', '\t', '\r', '\f'].indexOf(char) !== -1;
};
