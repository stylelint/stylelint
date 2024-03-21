import resolveNestedSelector from 'postcss-resolve-nested-selector';

import selectorParser from 'postcss-selector-parser';
const { isCombinator, isPseudo, isRoot, isSelector } = selectorParser;

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isContextFunctionalPseudoClass from '../../utils/isContextFunctionalPseudoClass.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
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
export default rule;
