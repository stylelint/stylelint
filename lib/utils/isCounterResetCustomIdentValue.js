'use strict';

const { counterResetKeywords } = require('../reference/keywords');

/**
 * Check value is a custom ident
 *
 * @param {string} value
 */
module.exports = function isCounterResetCustomIdentValue(value) {
	const valueLowerCase = value.toLowerCase();

	if (
		counterResetKeywords.has(valueLowerCase) ||
		Number.isFinite(Number.parseInt(valueLowerCase, 10))
	) {
		return false;
	}

	return true;
};
