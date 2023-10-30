// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const validateTypes = require('../../utils/validateTypes.cjs');
const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass.cjs');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
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
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			const count = selectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes that are not part of ignored functional pseudo-classes
				if (
					childNode.type === 'selector' ||
					(isContextFunctionalPseudoClass(childNode) &&
						!isIgnoredContextFunctionalPseudoClass(childNode))
				) {
					checkSelector(childNode, ruleNode);
				}

				if (childNode.type === 'id') total += 1;

				return total;
			}, 0);

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && count > primary) {
				const selector = selectorNode.toString();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selector, primary],
					word: selector,
				});
			}
		}

		/**
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {boolean}
		 */
		function isIgnoredContextFunctionalPseudoClass(node) {
			return (
				node.type === 'pseudo' &&
				optionsMatches(secondaryOptions, 'ignoreContextFunctionalPseudoClasses', node.value)
			);
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					parseSelector(resolvedSelector, result, ruleNode, (container) =>
						checkSelector(container, ruleNode),
					);
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
