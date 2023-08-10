'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const getAtRuleParams = require('./getAtRuleParams.cjs');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {ReturnType<typeof import('@csstools/media-query-list-parser').parse>}
 */
function parseMediaQuery(atRule) {
	const mediaQueries = mediaQueryListParser.parse(getAtRuleParams(atRule), {
		preserveInvalidMediaQueries: true,
	});

	return mediaQueries;
}

module.exports = parseMediaQuery;
