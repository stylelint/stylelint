'use strict';

const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const { selectorSpecificity: calculate, compare } = require('@csstools/selector-specificity');

const findAtRuleContext = require('../../utils/findAtRuleContext');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const keywordSets = require('../../reference/keywordSets');
const nodeContextLookup = require('../../utils/nodeContextLookup');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { assert } = require('../../utils/validateTypes');

const ruleName = 'no-descending-specificity';

const messages = ruleMessages(ruleName, {
	rejected: (b, a) => `Expected selector "${b}" to come before selector "${a}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/no-descending-specificity',
};

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

		const selectorContextLookup = nodeContextLookup();

		root.walkRules((ruleNode) => {
			// Ignore nested property `foo: {};`
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Ignores selectors within list of selectors
			if (
				optionsMatches(secondaryOptions, 'ignore', 'selectors-within-list') &&
				ruleNode.selectors.length > 1
			) {
				return;
			}

			const comparisonContext = selectorContextLookup.getContext(
				ruleNode,
				findAtRuleContext(ruleNode),
			);

			for (const selector of ruleNode.selectors) {
				const trimSelector = selector.trim();

				// Ignore `.selector, { }`
				if (trimSelector === '') {
					continue;
				}

				// Resolve any nested selectors before checking
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					parseSelector(resolvedSelector, result, ruleNode, (s) => {
						if (!isStandardSyntaxSelector(resolvedSelector)) {
							return;
						}

						checkSelector(s, ruleNode, comparisonContext);
					});
				}
			}
		});

		/**
		 * @param {import('postcss-selector-parser').Root} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 * @param {Map<any, any>} comparisonContext
		 */
		function checkSelector(selectorNode, ruleNode, comparisonContext) {
			const selector = selectorNode.toString();
			const referenceSelectorNode = lastCompoundSelectorWithoutPseudoClasses(selectorNode);
			const selectorSpecificity = calculate(selectorNode);
			const entry = { selector, specificity: selectorSpecificity };

			if (!comparisonContext.has(referenceSelectorNode)) {
				comparisonContext.set(referenceSelectorNode, [entry]);

				return;
			}

			/** @type {Array<typeof entry>} */
			const priorComparableSelectors = comparisonContext.get(referenceSelectorNode);

			for (const priorEntry of priorComparableSelectors) {
				if (compare(selectorSpecificity, priorEntry.specificity) < 0) {
					report({
						ruleName,
						result,
						node: ruleNode,
						message: messages.rejected(selector, priorEntry.selector),
						word: selector,
					});
				}
			}

			priorComparableSelectors.push(entry);
		}
	};
};

/**
 * @param {import('postcss-selector-parser').Root} selectorNode
 */
function lastCompoundSelectorWithoutPseudoClasses(selectorNode) {
	const firstChild = selectorNode.nodes[0];

	assert(firstChild);
	const nodesByCombinator = firstChild.split((node) => node.type === 'combinator');
	const nodesAfterLastCombinator = nodesByCombinator[nodesByCombinator.length - 1];

	assert(nodesAfterLastCombinator);
	const nodesWithoutPseudoClasses = nodesAfterLastCombinator
		.filter((node) => {
			return (
				node.type !== 'pseudo' ||
				node.value.startsWith('::') ||
				keywordSets.pseudoElements.has(node.value.replace(/:/g, ''))
			);
		})
		.join('');

	return nodesWithoutPseudoClasses.toString();
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
