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

/**
 * Returns a Boolean indicating whether the input string is only whitespace.
 *
 * @param {string} input
 * @returns {boolean}
 */
function isOnlyWhitespace(input) {
	for (const element of input) {
		if (!isWhitespace(element)) {
			return false;
		}
	}

	return true;
}

module.exports = isOnlyWhitespace;
