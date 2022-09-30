'use strict';

const { counterIncrementKeywords } = require('../reference/keywords');

/**
 * Check value is a custom ident
 *
 * @param {string} value
 */
module.exports = function isCounterIncrementCustomIdentValue(value) {
	const valueLowerCase = value.toLowerCase();

	if (
		counterIncrementKeywords.has(valueLowerCase) ||
		Number.isFinite(Number.parseInt(valueLowerCase, 10))
	) {
		return false;
	}

	return true;
};
