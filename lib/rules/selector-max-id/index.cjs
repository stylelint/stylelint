// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const flattenNestedSelectorsForRule = require('../../utils/flattenNestedSelectorsForRule.cjs');
const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass.cjs');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const selectorSourceIndex = require('../../utils/selectorSourceIndex.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'selector-max-id';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} ID ${max === 1 ? 'selector' : 'selectors'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-id',
};

/** @type {import('stylelint').Rule} */
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
					ignoreContextFunctionalPseudoClasses: [validateTypes.isString, validateTypes.isRegExp],
					checkContextFunctionalPseudoClasses: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Container<string | undefined>} resolvedSelectorNode
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(resolvedSelectorNode, selectorNode, ruleNode) {
			const count = resolvedSelectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes that aren't ignored
				if (
					childNode.type === 'selector' ||
					isCheckedContextFunctionalPseudoClass(childNode) ||
					isUnignoredContextFunctionalPseudoClass(childNode)
				) {
					checkSelector(childNode, selectorNode, ruleNode);
				}

				if (childNode.type === 'id') total += 1;

				return total;
			}, 0);

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && count > primary) {
				const index = selectorSourceIndex(selectorNode);
				const selectorStr = selectorNode.toString().trim();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selectorStr, primary],
					index,
					endIndex: index + selectorStr.length,
				});
			}
		}

		/**
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {node is import('postcss-selector-parser').Pseudo}
		 */
		function isUnignoredContextFunctionalPseudoClass(node) {
			return (
				isContextFunctionalPseudoClass(node) &&
				!optionsMatches(secondaryOptions, 'ignoreContextFunctionalPseudoClasses', node.value)
			);
		}

		/**
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {node is import('postcss-selector-parser').Pseudo}
		 */
		function isCheckedContextFunctionalPseudoClass(node) {
			return (
				node.type === 'pseudo' &&
				optionsMatches(secondaryOptions, 'checkContextFunctionalPseudoClasses', node.value)
			);
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			flattenNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.forEach((resolvedSelector) => {
					checkSelector(resolvedSelector, selector, ruleNode);
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
