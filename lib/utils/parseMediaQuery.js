'use strict';

const { parse } = require('@csstools/media-query-list-parser');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {ReturnType<typeof parse>}
 */
module.exports = function parseMediaQuery(atRule) {
	const source = atRule.params;
	const mediaQueries = parse(source, {
		preserveInvalidMediaQueries: true,
	});

	return mediaQueries;
};
