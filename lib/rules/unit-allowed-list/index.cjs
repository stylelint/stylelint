'use strict';

const valueParser = require('postcss-value-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const getDimension = require('../../utils/getDimension.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'unit-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unit-allowed-list',
};

/** @type {import('stylelint').Rule<string | string[]>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [validateTypes.isString],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [validateTypes.isString, validateTypes.isRegExp],
					ignoreProperties: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		const primaryValues = [primary].flat();

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function check(node, value, getIndex) {
			// make sure multiplication operations (*) are divided - not handled
			// by postcss-value-parser
			value = value.replaceAll('*', ',');
			valueParser(value).walk((valueNode) => {
				if (valueNode.type === 'function') {
					const valueLowerCase = valueNode.value.toLowerCase();

					// Ignore wrong units within `url` function
					if (valueLowerCase === 'url') {
						return false;
					}

					if (optionsMatches(secondaryOptions, 'ignoreFunctions', valueLowerCase)) {
						return false;
					}
				}

				const { number, unit } = getDimension(valueNode);

				if (!number || !unit || primaryValues.includes(unit.toLowerCase())) {
					return;
				}

				if (
					'prop' in node &&
					secondaryOptions &&
					optionsMatches(secondaryOptions.ignoreProperties, unit.toLowerCase(), node.prop)
				) {
					return;
				}

				const index = getIndex(node);

				report({
					index: index + valueNode.sourceIndex + number.length,
					endIndex: index + valueNode.sourceEndIndex,
					message: messages.rejected,
					messageArgs: [unit],
					node,
					result,
					ruleName,
				});
			});
		}

		root.walkAtRules(/^media$/i, (atRule) => check(atRule, atRule.params, atRuleParamIndex));
		root.walkDecls((decl) => check(decl, decl.value, declarationValueIndex));
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
