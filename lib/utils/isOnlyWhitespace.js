'use strict';

const isWhitespace = require('./isWhitespace');

/**
 * Returns a Boolean indicating whether the input string is only whitespace.
 *
 * @param {string} input
 * @returns {boolean}
 */
module.exports = function isOnlyWhitespace(input) {
	for (const element of input) {
		if (!isWhitespace(element)) {
			return false;
		}
	}

	return true;
};
