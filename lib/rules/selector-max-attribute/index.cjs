// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const selectorParser = require('postcss-selector-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const flattenNestedSelectorsForRule = require('../../utils/flattenNestedSelectorsForRule.cjs');
const getStrippedSelectorSource = require('../../utils/getStrippedSelectorSource.cjs');
const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass.cjs');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const { isRoot, isSelector } = selectorParser;

const ruleName = 'selector-max-attribute';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} attribute ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-attribute',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isNonNegativeInteger,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreAttributes: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Selector} resolvedSelectorNode
		 * @param {import('postcss-selector-parser').Selector} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(resolvedSelectorNode, selectorNode, ruleNode) {
			const count = resolvedSelectorNode.reduce((total, childNode) => {
				if (childNode.type !== 'attribute') {
					// Not an attribute node -> ignore
					return total;
				}

				if (optionsMatches(secondaryOptions, 'ignoreAttributes', childNode.attribute)) {
					// it's an attribute that is supposed to be ignored
					return total;
				}

				total += 1;

				return total;
			}, 0);

			if (count > primary) {
				const { index, endIndex, selector: selectorStr } = getStrippedSelectorSource(selectorNode);

				report.default({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selectorStr, primary],
					index,
					endIndex,
				});
			}
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			flattenNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.walk((childSelector) => {
					if (!isSelector(childSelector)) return;

					if (
						isRoot(childSelector.parent) ||
						isContextFunctionalPseudoClass(childSelector.parent)
					) {
						checkSelector(childSelector, selector, ruleNode);
					}
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
