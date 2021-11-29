'use strict';

const atRuleParamIndex = require('../utils/atRuleParamIndex');
const report = require('../utils/report');
const styleSearch = require('style-search');

/** @typedef {import('../utils/whitespaceChecker').WhitespaceCheckers} WhitespaceCheckers */

const startRegex = /(?<=\()[^(]+$/;
const endRegex = /^[^)]+(?=\))/;

/**
 * Gets the indices for the problem report.
 * @param {string} source The source string.
 * @param {number} colonIndex The index of the colon.
 * @param {keyof WhitespaceCheckers} location Whether the problem is before or
 * after the colon.
 * @returns {[start: number, end: number]} The indices for the problem report.
 * Start is inclusive, end is exclusive.
 */
function getIndices(source, colonIndex, location) {
	if (location.startsWith('before')) {
		const str = source.slice(0, colonIndex);
		const match = startRegex.exec(str);
		const start = match ? match.index : colonIndex;

		return [start, colonIndex + 1];
	}

	const str = source.slice(colonIndex);
	const match = endRegex.exec(str);
	const end = match ? colonIndex + match.index + match[0].length : colonIndex + 1;

	return [colonIndex, end];
}

/**
 * @param {{
 *   root: import('postcss').Root,
 *   checker: WhitespaceCheckers,
 *   location: keyof WhitespaceCheckers,
 *   fix: ((node: import('postcss').AtRule, index: number) => boolean) | null,
 *   result: import('stylelint').PostcssResult,
 *   checkedRuleName: string,
 * }} opts
 */
module.exports = function mediaFeatureColonSpaceChecker(opts) {
	opts.root.walkAtRules(/^media$/i, (atRule) => {
		const params = atRule.raws.params ? atRule.raws.params.raw : atRule.params;

		styleSearch({ source: params, target: ':' }, (match) => {
			checkColon(params, match.startIndex, atRule);
		});
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {import('postcss').AtRule} node
	 */
	function checkColon(source, index, node) {
		opts.checker[opts.location]({
			source,
			index,
			err: (message) => {
				const paramIndex = atRuleParamIndex(node);
				const [start, end] = getIndices(source, index, opts.location);

				if (opts.fix && opts.fix(node, paramIndex + index)) {
					return;
				}

				report({
					message,
					node,
					index: paramIndex + start,
					endIndex: paramIndex + end,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
