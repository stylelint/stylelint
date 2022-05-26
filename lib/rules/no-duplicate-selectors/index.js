'use strict';

const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const selectorParser = require('postcss-selector-parser');

const findAtRuleContext = require('../../utils/findAtRuleContext');
const isKeyframeRule = require('../../utils/isKeyframeRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const nodeContextLookup = require('../../utils/nodeContextLookup');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isBoolean } = require('../../utils/validateTypes');

const ruleName = 'no-duplicate-selectors';

const messages = ruleMessages(ruleName, {
	rejected: (selector, firstDuplicateLine) =>
		`Unexpected duplicate selector "${selector}", first used at line ${firstDuplicateLine}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/no-duplicate-selectors',
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

		root.walkRules((ruleNode) => {
			if (isKeyframeRule(ruleNode)) {
				return;
			}

			const contextSelectorSet = selectorContextLookup.getContext(
				ruleNode,
				findAtRuleContext(ruleNode),
			);
			const resolvedSelectorList = [
				...new Set(
					ruleNode.selectors.flatMap((selector) => resolvedNestedSelector(selector, ruleNode)),
				),
			];

			const normalizedSelectorList = resolvedSelectorList.map(normalize);

			// Sort the selectors list so that the order of the constituents
			// doesn't matter
			const sortedSelectorList = [...normalizedSelectorList].sort().join(',');

			if (!ruleNode.source) throw new Error('The rule node must have a source');

			if (!ruleNode.source.start) throw new Error('The rule source must have a start position');

			const selectorLine = ruleNode.source.start.line;

			// Complain if the same selector list occurs twice

			let previousDuplicatePosition;
			// When `disallowInList` is true, we must parse `sortedSelectorList` into
			// list items.
			/** @type {string[]} */
			const selectorListParsed = [];

			if (shouldDisallowDuplicateInList) {
				parseSelector(sortedSelectorList, result, ruleNode, (selectors) => {
					selectors.each((s) => {
						const selector = String(s);

						selectorListParsed.push(selector);

						if (contextSelectorSet.get(selector)) {
							previousDuplicatePosition = contextSelectorSet.get(selector);
						}
					});
				});
			} else {
				previousDuplicatePosition = contextSelectorSet.get(sortedSelectorList);
			}

			if (previousDuplicatePosition) {
				// If the selector isn't nested we can use its raw value; otherwise,
				// we have to approximate something for the message -- which is close enough
				const isNestedSelector = resolvedSelectorList.join(',') !== ruleNode.selectors.join(',');
				const selectorForMessage = isNestedSelector
					? resolvedSelectorList.join(', ')
					: ruleNode.selector;

				return report({
					result,
					ruleName,
					node: ruleNode,
					message: messages.rejected(selectorForMessage, previousDuplicatePosition),
					word: selectorForMessage,
				});
			}

			const presentedSelectors = new Set();
			const reportedSelectors = new Set();

			// Or complain if one selector list contains the same selector more than once
			for (const selector of ruleNode.selectors) {
				const normalized = normalize(selector);

				if (presentedSelectors.has(normalized)) {
					if (reportedSelectors.has(normalized)) {
						continue;
					}

					report({
						result,
						ruleName,
						node: ruleNode,
						message: messages.rejected(selector, selectorLine),
						word: selector,
					});
					reportedSelectors.add(normalized);
				} else {
					presentedSelectors.add(normalized);
				}
			}

			if (shouldDisallowDuplicateInList) {
				for (const selector of selectorListParsed) {
					// [selectorLine] will not really be accurate for multi-line
					// selectors, such as "bar" in "foo,\nbar {}".
					contextSelectorSet.set(selector, selectorLine);
				}
			} else {
				contextSelectorSet.set(sortedSelectorList, selectorLine);
			}
		});
	};
};

/**
 * @param {string} selector
 * @returns {string}
 */
function normalize(selector) {
	if (!isStandardSyntaxSelector(selector)) {
		return selector;
	}

	return selectorParser().processSync(selector, { lossless: false });
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
