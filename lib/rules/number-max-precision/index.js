'use strict';

const valueParser = require('postcss-value-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDimension = require('../../utils/getDimension');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isAtRule } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');
const { isNumber, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'number-max-precision';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/number-max-precision',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isNumber],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
					ignoreUnits: [isString, isRegExp],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (atRule.name.toLowerCase() === 'import') {
				return;
			}

			check(atRule, atRule.params);
		});

		root.walkDecls((decl) => check(decl, decl.value));

		/**
		 * @param {import('postcss').AtRule | import('postcss').Declaration} node
		 * @param {string} value
		 */
		function check(node, value) {
			// Get out quickly if there are no periods
			if (!value.includes('.')) {
				return;
			}

			const prop = 'prop' in node ? node.prop : undefined;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
				return;
			}

			valueParser(value).walk((valueNode) => {
				const { unit } = getDimension(valueNode);

				if (optionsMatches(secondaryOptions, 'ignoreUnits', unit)) {
					return;
				}

				// Ignore `url` function
				if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
					return false;
				}

				// Ignore strings, comments, etc
				if (valueNode.type !== 'word') {
					return;
				}

				const match = /\d*\.(\d+)/.exec(valueNode.value);

				if (match == null || match[0] == null || match[1] == null) {
					return;
				}

				if (match[1].length <= primary) {
					return;
				}

				const baseIndex = isAtRule(node) ? atRuleParamIndex(node) : declarationValueIndex(node);
				const actual = Number.parseFloat(match[0]);

				report({
					result,
					ruleName,
					node,
					index: baseIndex + valueNode.sourceIndex + match.index,
					word: actual.toString(),
					message: messages.expected(actual, actual.toFixed(primary)),
				});
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
