'use strict';

/**
 * Check if a string is a single line (i.e. does not contain
 * any newline characters).
 *
 * @param {string} input
 * @return {boolean}
 */
function isSingleLineString(input) {
	return !/[\n\r]/.test(input);
}

module.exports = isSingleLineString;
