'use strict';

const keywords = require('../reference/keywords.cjs');

/**
 * Check value is a custom ident
 *
 * @param {string} value
 */
function isCounterResetCustomIdentValue(value) {
	const valueLowerCase = value.toLowerCase();

	if (
		keywords.counterResetKeywords.has(valueLowerCase) ||
		Number.isFinite(Number.parseInt(valueLowerCase, 10))
	) {
		return false;
	}

	return true;
}

module.exports = isCounterResetCustomIdentValue;