'use strict';

const isStandardSyntaxRule = require('../utils/isStandardSyntaxRule');
const report = require('../utils/report');
const styleSearch = require('style-search');

/**
 * @param {{
 *   root: import('postcss').Root,
 *   result: import('stylelint').PostcssResult,
 *   locationChecker: (opts: { source: string, index: number, err: (msg: string) => void }) => void,
 *   checkedRuleName: string,
 *   fix: ((rule: import('postcss').Rule, index: number) => boolean) | null,
 * }} opts
 * @returns {void}
 */
module.exports = function selectorListCommaWhitespaceChecker(opts) {
	opts.root.walkRules((rule) => {
		if (!isStandardSyntaxRule(rule)) {
			return;
		}

		const selector = rule.raws.selector ? rule.raws.selector.raw : rule.selector;

		styleSearch(
			{
				source: selector,
				target: ',',
				functionArguments: 'skip',
			},
			(match) => {
				checkDelimiter(selector, match.startIndex, rule);
			},
		);
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {import('postcss').Rule} node
	 */
	function checkDelimiter(source, index, node) {
		opts.locationChecker({
			source,
			index,
			err: (message) => {
				if (opts.fix && opts.fix(node, index)) {
					return;
				}

				report({
					message,
					node,
					index,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
