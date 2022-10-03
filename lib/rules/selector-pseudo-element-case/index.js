'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const { levelOneAndTwoPseudoElements } = require('../../reference/selectors');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const transformSelector = require('../../utils/transformSelector');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-pseudo-element-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-case',
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

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			if (!selector.includes(':')) {
				return;
			}

			transformSelector(result, ruleNode, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					const pseudoElement = pseudoNode.value;

					if (!isStandardSyntaxSelector(pseudoElement)) {
						return;
					}

					if (
						!pseudoElement.includes('::') &&
						!levelOneAndTwoPseudoElements.has(pseudoElement.toLowerCase().slice(1))
					) {
						return;
					}

					const expectedPseudoElement =
						primary === 'lower' ? pseudoElement.toLowerCase() : pseudoElement.toUpperCase();

					if (pseudoElement === expectedPseudoElement) {
						return;
					}

					if (context.fix) {
						pseudoNode.value = expectedPseudoElement;

						return;
					}

					report({
						message: messages.expected(pseudoElement, expectedPseudoElement),
						node: ruleNode,
						index: pseudoNode.sourceIndex,
						ruleName,
						result,
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
