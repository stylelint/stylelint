// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const resolveNestedSelector = require('postcss-resolve-nested-selector');
const selectorParser = require('postcss-selector-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass.cjs');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const pluralize = require('../../utils/pluralize.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const { isCombinator, isPseudo, isRoot, isSelector } = selectorParser;

const ruleName = 'selector-max-compound-selectors';

const messages = ruleMessages(ruleName, {
	expected: (selector, /** @type {number} */ max) =>
		`Expected "${selector}" to have no more than ${max} compound ${pluralize('selector', max)}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-compound-selectors',
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
					ignoreSelectors: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Node} selectorNode
		 * @returns {boolean}
		 */
		function isSelectorIgnored(selectorNode) {
			const selector = isPseudo(selectorNode) ? selectorNode.value : selectorNode.toString();

			return optionsMatches(secondaryOptions, 'ignoreSelectors', selector);
		}

		/**
		 * Finds actual selectors in selectorNode object and checks them.
		 *
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			/** @type {import('postcss-selector-parser').Node[]} */
			const filteredChildNodes = [];

			selectorNode.each((childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (isSelector(childNode) || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, ruleNode);
				}

				if (!isSelectorIgnored(childNode)) {
					filteredChildNodes.push(childNode);
				}
			});

			// Normalize selector nodes and count combinators
			const combinatorCount = filteredChildNodes
				.filter((node, i, nodes) => {
					// Filter out a consecutive combinator
					return !(isCombinator(node) && i > 0 && isCombinator(nodes[i - 1]));
				})
				.filter((node, i, nodes) => {
					// Filter out a combinator at the edge
					return !(isCombinator(node) && (i === 0 || i === nodes.length - 1));
				})
				.filter(isCombinator).length;

			const compoundCount = combinatorCount + 1;

			if (!isRoot(selectorNode) && !isPseudo(selectorNode) && compoundCount > primary) {
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
				for (const resolvedSelector of resolveNestedSelector(selector, ruleNode)) {
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
