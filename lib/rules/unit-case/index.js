'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDimension = require('../../utils/getDimension');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'unit-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unit-case',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['lower', 'upper'],
		});

		if (!validOptions) {
			return;
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} checkedValue
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function check(node, checkedValue, getIndex) {
			/** @type {Array<{ index: number, endIndex: number, message: string }>} */
			const problems = [];

			/**
			 * @param {import('postcss-value-parser').Node} valueNode
			 * @returns {boolean}
			 */
			function processValue(valueNode) {
				const { number, unit } = getDimension(valueNode);

				if (!number || !unit) return false;

				const expectedUnit = primary === 'lower' ? unit.toLowerCase() : unit.toUpperCase();

				if (unit === expectedUnit) {
					return false;
				}

				const index = getIndex(node);

				problems.push({
					index: index + valueNode.sourceIndex + number.length,
					endIndex: index + valueNode.sourceEndIndex,
					message: messages.expected(unit, expectedUnit),
				});

				return true;
			}

			const parsedValue = valueParser(checkedValue).walk((valueNode) => {
				// Ignore wrong units within `url` function
				let needFix = false;
				const value = valueNode.value;

				if (valueNode.type === 'function' && value.toLowerCase() === 'url') {
					return false;
				}

				if (value.includes('*')) {
					value.split('*').some((val) => {
						return processValue({
							...valueNode,
							sourceIndex: value.indexOf(val) + val.length + 1,
							value: val,
						});
					});
				}

				needFix = processValue(valueNode);

				if (needFix && context.fix) {
					valueNode.value = primary === 'lower' ? value.toLowerCase() : value.toUpperCase();
				}
			});

			if (problems.length) {
				if (context.fix) {
					if ('name' in node && node.name === 'media') {
						node.params = parsedValue.toString();
					} else if ('value' in node) {
						node.value = parsedValue.toString();
					}
				} else {
					for (const err of problems) {
						report({
							index: err.index,
							endIndex: err.endIndex,
							message: err.message,
							node,
							result,
							ruleName,
						});
					}
				}
			}
		}

		root.walkAtRules((atRule) => {
			if (!/^media$/i.test(atRule.name) && !('variable' in atRule)) {
				return;
			}

			check(atRule, atRule.params, atRuleParamIndex);
		});
		root.walkDecls((decl) => check(decl, decl.value, declarationValueIndex));
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
