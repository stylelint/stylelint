'use strict';

const { parse } = require('@csstools/media-query-list-parser');
const getAtRuleParams = require('./getAtRuleParams.cjs');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {ReturnType<typeof parse>}
 */
module.exports = function parseMediaQuery(atRule) {
	const mediaQueries = parse(getAtRuleParams(atRule), {
		preserveInvalidMediaQueries: true,
	});

	return mediaQueries;
};
