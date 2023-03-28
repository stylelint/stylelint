'use strict';

const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-max-compound-selectors';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} compound ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-compound-selectors',
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
		 * Finds actual selectors in selectorNode object and checks them.
		 *
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			let compoundCount = 1;

			selectorNode.each((childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, ruleNode);
				}

				// Compound selectors are separated by combinators, so increase count when meeting one
				if (childNode.type === 'combinator') {
					compoundCount++;
				}
			});

			if (
				selectorNode.type !== 'root' &&
				selectorNode.type !== 'pseudo' &&
				compoundCount > primary
			) {
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

			// Using `.selectors` gets us each selector if there is a comma separated set
			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					// Process each resolved selector with `checkSelector` via postcss-selector-parser
					parseSelector(resolvedSelector, result, ruleNode, (s) => checkSelector(s, ruleNode));
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
