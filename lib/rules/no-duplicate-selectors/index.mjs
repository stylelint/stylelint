import findAtRuleContext from '../../utils/findAtRuleContext.mjs';
import flattenNestedSelectorsForRule from '../../utils/flattenNestedSelectorsForRule.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import getSelectorSourceIndex from '../../utils/getSelectorSourceIndex.mjs';
import { isBoolean } from '../../utils/validateTypes.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import nodeContextLookup from '../../utils/nodeContextLookup.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import parser from 'postcss-selector-parser';
import report from '../../utils/report.mjs';
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

/** @type {import('stylelint').Rule} */
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
		 * @param {import('postcss').Rule} node
		 * @param {string} selector
		 * @param {number} index
		 * @param {number} previousDuplicateLine
		 */
		function complain(node, selector, index, previousDuplicateLine) {
			report({
				result,
				ruleName,
				node,
				message: messages.rejected,
				messageArgs: [selector, previousDuplicateLine],
				index,
				endIndex: index + selector.length,
			});
		}

		/**
		 * Check selectors in the same rule:
		 * `a, b, a {}` -> double "a"
		 *
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelectorsInTheSameRule(ruleNode) {
			const selectorsInList = new Map();
			const selectors = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			selectors?.each((selector) => {
				const normalized = normalizeSelector(selector);
				const previousDuplicatePosition = selectorsInList.get(normalized);

				if (!previousDuplicatePosition) {
					selectorsInList.set(normalized, {
						line: (selector.source?.start?.line ?? 1) + (ruleNode.source?.start?.line ?? 1) - 1,
					});

					return;
				}

				const index = getSelectorSourceIndex(selector);
				const selectorStr = selector.toString().trim();

				complain(ruleNode, selectorStr, index, previousDuplicatePosition.line);
			});
		}

		/**
		 * Check selectors in different rules, but evaluate each selector list as a single item:
		 * `a, b {} b, a {}` -> double "a, b"
		 *
		 * @param {import('postcss').Rule} ruleNode
		 * @param {Map<string, { line: number }>} contextSelectorSet
		 */
		function checkSelectorListInDifferentRules(ruleNode, contextSelectorSet) {
			const combinedRoot = parser.root({
				nodes: flattenNestedSelectorsForRule(ruleNode, result).flatMap(
					({ resolvedSelectors }) => resolvedSelectors.nodes,
				),
				value: '',
			});

			const normalized = normalizeSelector(combinedRoot);
			const previousDuplicatePosition = contextSelectorSet.get(normalized);

			if (!previousDuplicatePosition) {
				contextSelectorSet.set(normalized, {
					line: ruleNode.source?.start?.line ?? 1,
				});

				return;
			}

			const selector = getRuleSelector(ruleNode);
			const selectorStr = selector.toString().trim();

			complain(ruleNode, selectorStr, 0, previousDuplicatePosition.line);
		}

		/**
		 * Check selectors in different rules, and evaluate each selector as an individual item:
		 * `a, b {} a {}` -> double "a"
		 *
		 * @param {import('postcss').Rule} ruleNode
		 * @param {Map<string, { line: number }>} contextSelectorSet
		 */
		function checkSelectorsInDifferentRules(ruleNode, contextSelectorSet) {
			flattenNestedSelectorsForRule(ruleNode, result).forEach((flattenedSelector) => {
				const { selector, resolvedSelectors } = flattenedSelector;

				resolvedSelectors.each((resolvedSelector) => {
					const normalized = normalizeSelector(resolvedSelector);
					const previousDuplicatePosition = contextSelectorSet.get(normalized);

					if (!previousDuplicatePosition) {
						contextSelectorSet.set(normalized, {
							line: (selector.source?.start?.line ?? 1) + (ruleNode.source?.start?.line ?? 1) - 1,
						});

						return;
					}

					const index = getSelectorSourceIndex(selector);
					const selectorStr = selector.toString().trim();

					complain(ruleNode, selectorStr, index, previousDuplicatePosition.line);
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

/**
 * @param {import('postcss-selector-parser').Root | import('postcss-selector-parser').Selector} node
 * @returns {string}
 */
function normalizeSelector(node) {
	const clone = node.clone();

	normalizeSelectorNodeWhitespace(clone);

	clone.walk(normalizeSelectorNodeWhitespace);

	normalizeSelectorNodesOrder(clone);

	return clone.toString();
}

/**
 * @param {import('postcss-selector-parser').Node} node
 */
function normalizeSelectorNodeWhitespace(node) {
	node.rawSpaceBefore = '';
	node.rawSpaceAfter = '';

	if ('raws' in node) {
		node.raws = normalizeWhitespaceOnlyStringsInObject(node.raws);
	}

	if ('spaces' in node) {
		node.spaces = normalizeWhitespaceOnlyStringsInObject(node.spaces);
	}
}

/**
 * @param {import('postcss-selector-parser').Node} node
 */
function normalizeSelectorNodesOrder(node) {
	if (!parser.isContainer(node)) return;

	// Need to sort inside out, not outside in.
	// As the parents needs to sorted with their children already in the right order.
	node.each(normalizeSelectorNodesOrder);

	if (parser.isRoot(node) || parser.isPseudoClass(node) || parser.isPseudoElement(node)) {
		const nodes = node.nodes.map((childNode) => {
			// Make sure to only stringify the node once.
			return { node: childNode, string: childNode.toString() };
		});

		nodes.sort((a, b) => a.string.localeCompare(b.string));

		const nodesIndices = new Map();

		nodes.forEach((x, i) => {
			nodesIndices.set(x.node, i);
		});

		node.nodes.sort((a, b) => {
			return nodesIndices.get(a) - nodesIndices.get(b);
		});
	}
}

/**
 * @template {unknown} T
 * @param {T} object
 * @returns {T}
 */
function normalizeWhitespaceOnlyStringsInObject(object) {
	// Recursively collapse any string values that contain only whitespace.
	// JSON.parse/stringify can do recursive walks and has internal optimizations for stringify and immediate parse.
	return JSON.parse(
		JSON.stringify(object, (_, value) => {
			if (typeof value === 'string' && /^\s+$/.test(value)) {
				return '';
			}

			return value;
		}),
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
