/* @flow */
'use strict';

const keywordSets = require('../reference/keywordSets');

/**
 * Check value is a custom ident
 */

module.exports = function(value /*: string*/) /*: boolean*/ {
	const valueLowerCase = value.toLowerCase();

	if (
		keywordSets.counterResetKeywords.has(valueLowerCase) ||
		Number.isFinite(parseInt(valueLowerCase))
	) {
		return false;
	}

	return true;
};
