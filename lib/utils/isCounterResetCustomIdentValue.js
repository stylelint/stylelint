/* @flow */
'use strict';

const _ = require('lodash');
const keywordSets = require('../reference/keywordSets');

/**
 * Check value is a custom ident
 *
 * @param {string} value
 */
module.exports = function(value /*: string*/) /*: boolean*/ {
	const valueLowerCase = value.toLowerCase();

	if (
		keywordSets.counterResetKeywords.has(valueLowerCase) ||
		_.isFinite(parseInt(valueLowerCase))
	) {
		return false;
	}

	return true;
};
