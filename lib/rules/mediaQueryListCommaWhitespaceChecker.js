'use strict';

const atRuleParamIndex = require('../utils/atRuleParamIndex');
const report = require('../utils/report');
const styleSearch = require('style-search');

/**
 * @param {{
 *   root: import('postcss').Root,
 *   result: import('stylelint').PostcssResult,
 *   locationChecker: (args: { source: string, index: number, err: (message: string) => void }) => void,
 *   checkedRuleName: string,
 *   fix?: ((atRule: import('postcss').AtRule, index: number) => boolean) | null | undefined,
 *   allowTrailingComments?: boolean,
 * }} opts
 */
module.exports = function mediaQueryListCommaWhitespaceChecker(opts) {
	opts.root.walkAtRules(/^media$/i, (atRule) => {
		const params = atRule.raws.params ? atRule.raws.params.raw : atRule.params;

		styleSearch({ source: params, target: ',' }, (match) => {
			let index = match.startIndex;

			if (opts.allowTrailingComments) {
				// if there is a comment on the same line at after the comma, check the space after the comment.
				let execResult;

				while ((execResult = /^[^\S\r\n]*\/\*([\s\S]*?)\*\//.exec(params.slice(index + 1)))) {
					index += execResult[0].length;
				}

				if ((execResult = /^([^\S\r\n]*\/\/[\s\S]*?)\r?\n/.exec(params.slice(index + 1)))) {
					index += execResult[1].length;
				}
			}

			checkComma(params, index, atRule);
		});
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {import('postcss').AtRule} node
	 */
	function checkComma(source, index, node) {
		opts.locationChecker({
			source,
			index,
			err: (message) => {
				const commaIndex = index + atRuleParamIndex(node);

				if (opts.fix && opts.fix(node, commaIndex)) {
					return;
				}

				report({
					message,
					node,
					index: commaIndex,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
