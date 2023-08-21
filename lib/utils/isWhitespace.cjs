'use strict';

/**
 * Check if a character is whitespace.
 *
 * @param {string} char
 * @returns {boolean}
 */
function isWhitespace(char) {
	return [' ', '\n', '\t', '\r', '\f'].includes(char);
}

module.exports = isWhitespace;
