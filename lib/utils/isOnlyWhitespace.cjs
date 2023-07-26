'use strict';

const isWhitespace = require('./isWhitespace.cjs');

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
