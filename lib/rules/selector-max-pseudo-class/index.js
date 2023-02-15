'use strict';

const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const { levelOneAndTwoPseudoElements } = require('../../reference/selectors');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-max-pseudo-class';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} pseudo-${max === 1 ? 'class' : 'classes'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-pseudo-class',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: isNonNegativeInteger,
		});

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Container<unknown>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			const count = selectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, ruleNode);
				}

				// Exclude pseudo elements from the count
				if (
					childNode.type === 'pseudo' &&
					(childNode.value.includes('::') ||
						levelOneAndTwoPseudoElements.has(childNode.value.toLowerCase().slice(1)))
				) {
					return total;
				}

				if (childNode.type === 'pseudo') {
					total += 1;
				}

				return total;
			}, 0);

			if (count > primary) {
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

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					parseSelector(resolvedSelector, result, ruleNode, (selectorTree) => {
						checkSelector(selectorTree, ruleNode);
					});
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
