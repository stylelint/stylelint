import { compare, selectorSpecificity } from '@csstools/selector-specificity';

import findAtRuleContext from '../../utils/findAtRuleContext.mjs';
import flattenNestedSelectorsForRule from '../../utils/flattenNestedSelectorsForRule.mjs';
import getSelectorSourceIndex from '../../utils/getSelectorSourceIndex.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import nodeContextLookup from '../../utils/nodeContextLookup.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import { pseudoElements } from '../../reference/selectors.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-descending-specificity';

const messages = ruleMessages(ruleName, {
	rejected: (b, a) => {
		return `Expected selector "${b}" to come before selector "${a}"`;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-descending-specificity',
};

/** @typedef {{ selector: string, specificity: import('@csstools/selector-specificity').Specificity }} Entry */

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignore: ['selectors-within-list'],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreSelectorsWithinList = optionsMatches(
			secondaryOptions,
			'ignore',
			'selectors-within-list',
		);

		const selectorContextLookup = nodeContextLookup();

		root.walkRules((ruleNode) => {
			// Ignore nested property `foo: {};`
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Ignores selectors within list of selectors
			if (ignoreSelectorsWithinList && ruleNode.selectors.length > 1) {
				return;
			}

			/** @type {Map<string, Entry[]>} */
			const comparisonContext = selectorContextLookup.getContext(
				ruleNode,
				findAtRuleContext(ruleNode),
			);

			// Resolve any nested selectors before checking
			flattenNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.each((resolvedSelector) => {
					checkSelector(resolvedSelector, selector, ruleNode, comparisonContext);
				});
			});
		});

		/**
		 * @param {import('postcss-selector-parser').Selector} resolvedSelectorNode
		 * @param {import('postcss-selector-parser').Selector} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 * @param {Map<string, Entry[]>} comparisonContext
		 */
		function checkSelector(resolvedSelectorNode, selectorNode, ruleNode, comparisonContext) {
			const referenceSelector = lastCompoundSelectorWithoutPseudoClasses(selectorNode);

			if (!referenceSelector) return;

			const specificity = selectorSpecificity(resolvedSelectorNode);
			const entry = {
				selector: resolvedSelectorNode.toString().trim(),
				specificity,
			};
			const priorComparableSelectors = comparisonContext.get(referenceSelector);

			if (!priorComparableSelectors) {
				comparisonContext.set(referenceSelector, [entry]);

				return;
			}

			for (const priorEntry of priorComparableSelectors) {
				if (compare(specificity, priorEntry.specificity) < 0) {
					const index = getSelectorSourceIndex(selectorNode);
					const selectorStr = selectorNode.toString().trim();

					report({
						ruleName,
						result,
						node: ruleNode,
						message: messages.rejected,
						messageArgs: [selectorStr, priorEntry.selector],
						index,
						endIndex: index + selectorStr.length,
					});

					break;
				}
			}

			priorComparableSelectors.push(entry);
		}
	};
};

/**
 * @param {import('postcss-selector-parser').Selector} selectorNode
 * @returns {string | undefined}
 */
function lastCompoundSelectorWithoutPseudoClasses(selectorNode) {
	const nodesByCombinator = selectorNode.split((node) => node.type === 'combinator');
	const nodesAfterLastCombinator = nodesByCombinator[nodesByCombinator.length - 1];

	if (!nodesAfterLastCombinator) return undefined;

	const nodesWithoutPseudoClasses = nodesAfterLastCombinator.filter((node) => {
		return (
			node.type !== 'pseudo' ||
			node.value.startsWith('::') ||
			pseudoElements.has(node.value.replaceAll(':', ''))
		);
	});

	if (nodesWithoutPseudoClasses.length === 0) return undefined;

	return nodesWithoutPseudoClasses.join('');
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
