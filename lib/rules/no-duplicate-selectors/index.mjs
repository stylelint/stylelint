import selectorParser from 'postcss-selector-parser';

import { isBoolean, isRegExp, isString } from '../../utils/validateTypes.mjs';
import findAtRuleContext from '../../utils/findAtRuleContext.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import nodeContextLookup from '../../utils/nodeContextLookup.mjs';
import normalizeSelector from '../../utils/normalizeSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-duplicate-selectors';

const messages = ruleMessages(ruleName, {
	rejected: (selector, firstDuplicateLine) =>
		`Unexpected duplicate selector "${selector}", first used at line ${firstDuplicateLine}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-duplicate-selectors',
};

/** @import { Rule as PostcssRule } from 'postcss' */
/** @import { Node as SelectorNode, Root as SelectorRoot, Selector } from 'postcss-selector-parser' */

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					disallowInList: [isBoolean],
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const shouldDisallowDuplicateInList = secondaryOptions && secondaryOptions.disallowInList;

		// The top level of this map will be rule sources.
		// Each source maps to another map, which maps rule parents to a set of selectors.
		// This ensures that selectors are only checked against selectors
		// from other rules that share the same parent and the same source.
		const selectorContextLookup = nodeContextLookup();

		/**
		 * @param {PostcssRule} node
		 * @param {string} selector
		 * @param {number} index
		 * @param {number} endIndex
		 * @param {number} previousDuplicateLine
		 */
		function complain(node, selector, index, endIndex, previousDuplicateLine) {
			report({
				result,
				ruleName,
				node,
				message: messages.rejected,
				messageArgs: [selector, previousDuplicateLine],
				index,
				endIndex,
			});
		}

		/**
		 * Check selectors in the same rule:
		 * `a, b, a {}` -> double "a"
		 *
		 * @param {PostcssRule} ruleNode
		 */
		function checkSelectorsInTheSameRule(ruleNode) {
			const selectorsInList = new Map();
			const selectors = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			selectors?.each((selector) => {
				const normalized = normalizeSelector(selector.clone()).toString();

				if (optionsMatches(secondaryOptions, 'ignoreSelectors', normalized)) {
					return;
				}

				const previousDuplicatePosition = selectorsInList.get(normalized);

				if (!previousDuplicatePosition) {
					selectorsInList.set(normalized, {
						// line numbers start at 1, adding two line numbers together requires subtracting 1
						line: (selector.source?.start?.line ?? 1) + (ruleNode.source?.start?.line ?? 1) - 1,
					});

					return;
				}

				const { index, endIndex, selector: selectorStr } = getStrippedSelectorSource(selector);

				complain(ruleNode, selectorStr, index, endIndex, previousDuplicatePosition.line);
			});
		}

		/**
		 * Check selectors in different rules, but evaluate each selector list as a single item:
		 * `a, b {} b, a {}` -> double "a, b"
		 *
		 * @param {PostcssRule} ruleNode
		 * @param {Map<string, { line: number }>} contextSelectorSet
		 */
		function checkSelectorListInDifferentRules(ruleNode, contextSelectorSet) {
			const resolvedSelectorsNodes = resolveNestedSelectorsForRule(ruleNode, result).flatMap(
				({ resolvedSelectors }) => resolvedSelectors.nodes,
			);

			if (!resolvedSelectorsNodes.length) return;

			const hasIgnoredSelector = resolvedSelectorsNodes.some((selector) => {
				const normalized = normalizeSelector(selector.clone()).toString();

				return optionsMatches(secondaryOptions, 'ignoreSelectors', normalized);
			});

			if (hasIgnoredSelector) return;

			const combinedRoot = selectorParser.root({
				nodes: resolvedSelectorsNodes,
				value: '',
			});

			const normalized = normalizeSelector(combinedRoot).toString();
			const previousDuplicatePosition = contextSelectorSet.get(normalized);

			if (!previousDuplicatePosition) {
				contextSelectorSet.set(normalized, {
					line: ruleNode.source?.start?.line ?? 1,
				});

				return;
			}

			const selector = getRuleSelector(ruleNode);
			const selectorStr = selector.toString().trim();

			complain(ruleNode, selectorStr, 0, selectorStr.length, previousDuplicatePosition.line);
		}

		/**
		 * Check selectors in different rules, and evaluate each selector as an individual item:
		 * `a, b {} a {}` -> double "a"
		 *
		 * @param {PostcssRule} ruleNode
		 * @param {Map<string, { line: number }>} contextSelectorSet
		 */
		function checkSelectorsInDifferentRules(ruleNode, contextSelectorSet) {
			resolveNestedSelectorsForRule(ruleNode, result).forEach((resolvedSelectorEntry) => {
				const { selector, resolvedSelectors } = resolvedSelectorEntry;

				resolvedSelectors.each((resolvedSelector) => {
					const normalized = normalizeSelector(resolvedSelector).toString();

					if (optionsMatches(secondaryOptions, 'ignoreSelectors', normalized)) {
						return;
					}

					const previousDuplicatePosition = contextSelectorSet.get(normalized);

					if (!previousDuplicatePosition) {
						contextSelectorSet.set(normalized, {
							// line numbers start at 1, adding two line numbers together requires subtracting 1
							line: (selector.source?.start?.line ?? 1) + (ruleNode.source?.start?.line ?? 1) - 1,
						});

						return;
					}

					const { index, endIndex, selector: selectorStr } = getStrippedSelectorSource(selector);

					complain(ruleNode, selectorStr, index, endIndex, previousDuplicatePosition.line);
				});
			});
		}

		root.walkRules((ruleNode) => {
			if (isKeyframeRule(ruleNode)) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

			const contextSelectorSet = selectorContextLookup.getContext(
				ruleNode,
				findAtRuleContext(ruleNode),
			);

			if (shouldDisallowDuplicateInList) {
				checkSelectorsInDifferentRules(ruleNode, contextSelectorSet);

				return;
			}

			checkSelectorsInTheSameRule(ruleNode);
			checkSelectorListInDifferentRules(ruleNode, contextSelectorSet);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
