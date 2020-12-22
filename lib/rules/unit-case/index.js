// @ts-nocheck

'use strict';

const _ = require('lodash');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'unit-case';
const mathRegExp = /\+|-|\*|\//;

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

function rule(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: expectation,
				possible: ['lower', 'upper'],
			},
			{
				actual: options,
				possible: {
					ignoreUnits: [_.isString, _.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		function toggleCase(unit) {
			let fixedVal = unit;
			const units = unit.split(mathRegExp);

			units
				.map((val) => {
					if (!optionsMatches(options, 'ignoreUnits', val)) {
						return expectation === 'lower' ? val.toLowerCase() : val.toUpperCase();
					}

					return val;
				})
				.forEach((val, index) => {
					if (units[index] !== val) {
						fixedVal = fixedVal.replace(units[index], val);
					}
				});

			return fixedVal;
		}

		function check(node, value, getIndex) {
			const violations = [];

			function processValue(valueNode) {
				const unit = optionsMatches(options, 'ignoreUnits', valueNode.value)
					? valueNode.value
					: getUnitFromValueNode(valueNode);

				if (!unit) {
					return false;
				}

				const expectedUnit = toggleCase(unit);

				if (unit === expectedUnit) {
					return false;
				}

				violations.push({
					index: getIndex(node) + valueNode.sourceIndex,
					message: messages.expected(unit, expectedUnit),
				});

				return true;
			}

			const parsedValue = valueParser(value).walk((valueNode) => {
				// Ignore wrong units within `url` function
				let needFix = false;
				// TODO: Issue #4985
				// eslint-disable-next-line no-shadow
				const value = valueNode.value;

				if (valueNode.type === 'function' && value.toLowerCase() === 'url') {
					return false;
				}

				if (mathRegExp.test(value)) {
					value.split(mathRegExp).some((val) => {
						return processValue({
							...valueNode,
							sourceIndex: value.indexOf(val) + val.length + 1,
							value: val,
						});
					});
				}

				needFix = processValue(valueNode);

				if (needFix && context.fix) {
					valueNode.value = toggleCase(valueNode.value);
				}
			});

			if (violations.length) {
				if (context.fix) {
					if (node.name === 'media') {
						node.params = parsedValue.toString();
					} else {
						node.value = parsedValue.toString();
					}
				} else {
					violations.forEach((err) => {
						report({
							index: err.index,
							message: err.message,
							node,
							result,
							ruleName,
						});
					});
				}
			}
		}

		root.walkAtRules((atRule) => {
			if (!/^media$/i.test(atRule.name) && !atRule.variable) {
				return;
			}

			check(atRule, atRule.params, atRuleParamIndex);
		});
		root.walkDecls((decl) => check(decl, decl.value, declarationValueIndex));
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
