import selectorParser from 'postcss-selector-parser';
const { isCombinator, isPseudo, isRoot, isSelector } = selectorParser;

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import flattenNestedSelectorsForRule from '../../utils/flattenNestedSelectorsForRule.mjs';
import isContextFunctionalPseudoClass from '../../utils/isContextFunctionalPseudoClass.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import pluralize from '../../utils/pluralize.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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
					ignoreSelectors: [isString, isRegExp],
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
		 * @param {import('postcss-selector-parser').Container<string | undefined>} resolvedSelectorNode
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(resolvedSelectorNode, selectorNode, ruleNode) {
			/** @type {import('postcss-selector-parser').Node[]} */
			const filteredChildNodes = [];

			resolvedSelectorNode.each((childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (isSelector(childNode) || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, selectorNode, ruleNode);
				}

				if (!isSelectorIgnored(childNode)) {
					filteredChildNodes.push(childNode);
				}
			});

			if (isRoot(selectorNode) || isPseudo(selectorNode)) return;

			// Normalize selector nodes and count combinators
			const combinatorCount = filteredChildNodes.reduce((count, node, i, nodes) => {
				// Not count a node except a combinator
				if (!isCombinator(node)) return count;

				// Not count a combinator at the edge
				if (i === 0 || i === nodes.length - 1) return count;

				// Not count a consecutive combinator
				if (isCombinator(nodes[i + 1])) return count;

				return count + 1;
			}, 0);

			const compoundCount = combinatorCount + 1;

			if (compoundCount > primary) {
				const index = selectorNode.first?.sourceIndex ?? 0;
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

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (!isStandardSyntaxSelector(ruleNode.selector)) return;

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
export default rule;
