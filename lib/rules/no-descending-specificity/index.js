'use strict';

const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const { selectorSpecificity: calculate, compare } = require('@csstools/selector-specificity');

const findAtRuleContext = require('../../utils/findAtRuleContext');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const { pseudoElements } = require('../../reference/selectors');
const nodeContextLookup = require('../../utils/nodeContextLookup');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-descending-specificity';

const messages = ruleMessages(ruleName, {
	rejected: (b, a) => `Expected selector "${b}" to come before selector "${a}"`,
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

			const selectors = ruleNode.selectors;

			// Ignores selectors within list of selectors
			if (ignoreSelectorsWithinList && selectors.length > 1) {
				return;
			}

			/** @type {Map<string, Entry[]>} */
			const comparisonContext = selectorContextLookup.getContext(
				ruleNode,
				findAtRuleContext(ruleNode),
			);

			for (const selector of selectors) {
				// Ignore `.selector, { }`
				if (selector.trim() === '') {
					continue;
				}

				// Resolve any nested selectors before checking
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					if (!isStandardSyntaxSelector(resolvedSelector)) {
						continue;
					}

					parseSelector(resolvedSelector, result, ruleNode, (s) => {
						checkSelector(resolvedSelector, s, ruleNode, comparisonContext);
					});
				}
			}
		});

		/**
		 * @param {string} selector
		 * @param {import('postcss-selector-parser').Root} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 * @param {Map<string, Entry[]>} comparisonContext
		 */
		function checkSelector(selector, selectorNode, ruleNode, comparisonContext) {
			const referenceSelector = lastCompoundSelectorWithoutPseudoClasses(selectorNode);

			if (!referenceSelector) return;

			const selectorSpecificity = calculate(selectorNode);
			const entry = { selector, specificity: selectorSpecificity };
			const priorComparableSelectors = comparisonContext.get(referenceSelector);

			if (!priorComparableSelectors) {
				comparisonContext.set(referenceSelector, [entry]);

				return;
			}

			for (const priorEntry of priorComparableSelectors) {
				if (compare(selectorSpecificity, priorEntry.specificity) < 0) {
					report({
						ruleName,
						result,
						node: ruleNode,
						message: messages.rejected,
						messageArgs: [selector, priorEntry.selector],
						word: selector,
					});

					break;
				}
			}

			priorComparableSelectors.push(entry);
		}
	};
};

/**
 * @param {import('postcss-selector-parser').Root} selectorNode
 * @returns {string | undefined}
 */
function lastCompoundSelectorWithoutPseudoClasses(selectorNode) {
	const firstChild = selectorNode.nodes[0];

	if (!firstChild) return undefined;

	const nodesByCombinator = firstChild.split((node) => node.type === 'combinator');
	const nodesAfterLastCombinator = nodesByCombinator[nodesByCombinator.length - 1];

	if (!nodesAfterLastCombinator) return undefined;

	const nodesWithoutPseudoClasses = nodesAfterLastCombinator.filter((node) => {
		return (
			node.type !== 'pseudo' ||
			node.value.startsWith('::') ||
			pseudoElements.has(node.value.replace(/:/g, ''))
		);
	});

	if (nodesWithoutPseudoClasses.length === 0) return undefined;

	return nodesWithoutPseudoClasses.join('');
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
