'use strict';

const isWhitespace = require('./isWhitespace');

/**
 * Returns a Boolean indicating whether the the input string is only whitespace.
 *
 * @param {string} input
 * @returns {boolean}
 */
module.exports = function (input) {
	let isOnlyWhitespace = true;

	for (const element of input) {
		if (!isWhitespace(element)) {
			isOnlyWhitespace = false;
			break;
		}
	}

	return isOnlyWhitespace;
};
