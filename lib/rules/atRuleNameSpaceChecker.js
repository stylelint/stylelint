'use strict';

const isStandardSyntaxAtRule = require('../utils/isStandardSyntaxAtRule');
const report = require('../utils/report');

/**
 * @param {{
 *   root: import('postcss').Root,
 *   locationChecker: (opts: { source: string, index: number, err: (msg: string) => void, errTarget: string }) => void,
 *   result: import('stylelint').PostcssResult,
 *   checkedRuleName: string,
 *   fix?: ((atRule: import('postcss').AtRule) => void) | null,
 * }} options
 */
module.exports = function atRuleNameSpaceChecker(options) {
	options.root.walkAtRules((atRule) => {
		if (!isStandardSyntaxAtRule(atRule)) {
			return;
		}

		checkColon(`@${atRule.name}${atRule.raws.afterName || ''}${atRule.params}`, atRule);
	});

	/**
	 * @param {string} source
	 * @param {import('postcss').AtRule} node
	 */
	function checkColon(source, node) {
		options.locationChecker({
			source,
			index: node.name.length,
			err: (m) => {
				if (options.fix) {
					options.fix(node);

					return;
				}

				report({
					message: m,
					node,
					index: 0,
					endIndex: node.name.length + 1,
					result: options.result,
					ruleName: options.checkedRuleName,
				});
			},
			errTarget: `@${node.name}`,
		});
	}
};
