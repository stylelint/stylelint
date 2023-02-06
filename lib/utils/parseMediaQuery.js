'use strict';

const { parse, isMediaQueryInvalid } = require('@csstools/media-query-list-parser');

/**
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 * @returns {ReturnType<typeof parse>}
 */
module.exports = function parseMediaQuery(atRule, result) {
	const source = atRule.params;
	const mediaQueries = parse(source, {
		preserveInvalidMediaQueries: true,
	});

	mediaQueries.forEach((mediaQuery) => {
		if (isMediaQueryInvalid(mediaQuery)) {
			result.warn(`Cannot parse media query`, {
				node: atRule,
				word: source,
				stylelintType: 'parseError',
			});
		}
	});

	return mediaQueries;
};
