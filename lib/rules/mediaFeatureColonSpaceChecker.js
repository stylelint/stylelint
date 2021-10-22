'use strict';

const atRuleParamIndex = require('../utils/atRuleParamIndex');
const report = require('../utils/report');
const styleSearch = require('style-search');

/**
 * @param {{
 *   root: import('postcss').Root,
 *   locationChecker: (args: { source: string, index: number, err: (message: string) => void }) => void,
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
		opts.locationChecker({
			source,
			index,
			err: (message) => {
				const colonIndex = index + atRuleParamIndex(node);

				if (opts.fix && opts.fix(node, colonIndex)) {
					return;
				}

				report({
					message,
					node,
					index: colonIndex,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
