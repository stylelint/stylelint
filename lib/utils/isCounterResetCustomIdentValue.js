'use strict';

const keywordSets = require('../reference/keywordSets');

/**
 * Check value is a custom ident
 *
 * @param {string} value
 */
module.exports = function (value) {
	const valueLowerCase = value.toLowerCase();

	if (
		keywordSets.counterResetKeywords.has(valueLowerCase) ||
		Number.isFinite(Number.parseInt(valueLowerCase, 10))
	) {
		return false;
	}

	return true;
};
