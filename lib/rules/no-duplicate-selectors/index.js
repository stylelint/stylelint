// @ts-nocheck

'use strict';

const _ = require('lodash');
const findAtRuleContext = require('../../utils/findAtRuleContext');
const isKeyframeRule = require('../../utils/isKeyframeRule');
const nodeContextLookup = require('../../utils/nodeContextLookup');
const normalizeSelector = require('normalize-selector');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-duplicate-selectors';

const messages = ruleMessages(ruleName, {
	rejected: (selector, firstDuplicateLine) =>
		`Unexpected duplicate selector "${selector}", first used at line ${firstDuplicateLine}`,
});

function rule(actual, options) {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual },
			{
				actual: options,
				possible: {
					disallowInList: _.isBoolean,
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const shouldDisallowDuplicateInList = _.get(options, 'disallowInList');

		// The top level of this map will be rule sources.
		// Each source maps to another map, which maps rule parents to a set of selectors.
		// This ensures that selectors are only checked against selectors
		// from other rules that share the same parent and the same source.
		const selectorContextLookup = nodeContextLookup();

		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		root.walkRules((rule) => {
			if (isKeyframeRule(rule)) {
				return;
			}

			const contextSelectorSet = selectorContextLookup.getContext(rule, findAtRuleContext(rule));
			// TODO: Issue #4985
			// eslint-disable-next-line no-shadow
			const resolvedSelectors = rule.selectors.reduce((result, selector) => {
				return _.union(result, resolvedNestedSelector(selector, rule));
			}, []);

			const normalizedSelectorList = resolvedSelectors.map(normalizeSelector);

			// Sort the selectors list so that the order of the constituents
			// doesn't matter
			const sortedSelectorList = normalizedSelectorList.slice().sort().join(',');

			const selectorLine = rule.source.start.line;

			// Complain if the same selector list occurs twice

			let previousDuplicatePosition;
			// When `disallowInList` is true, we must parse `sortedSelectorList` into
			// list items.
			let selectorListParsed = [];

			if (shouldDisallowDuplicateInList) {
				parseSelector(sortedSelectorList, result, rule, (selectors) => {
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
				const isNestedSelector = resolvedSelectors.join(',') !== rule.selectors.join(',');
				const selectorForMessage = isNestedSelector ? resolvedSelectors.join(', ') : rule.selector;

				return report({
					result,
					ruleName,
					node: rule,
					message: messages.rejected(selectorForMessage, previousDuplicatePosition),
				});
			}

			const presentedSelectors = new Set();
			const reportedSelectors = new Set();

			// Or complain if one selector list contains the same selector more than once
			rule.selectors.forEach((selector) => {
				const normalized = normalizeSelector(selector);

				if (presentedSelectors.has(normalized)) {
					if (reportedSelectors.has(normalized)) {
						return;
					}

					report({
						result,
						ruleName,
						node: rule,
						message: messages.rejected(selector, selectorLine),
					});
					reportedSelectors.add(normalized);
				} else {
					presentedSelectors.add(normalized);
				}
			});

			if (shouldDisallowDuplicateInList) {
				for (let selector of selectorListParsed) {
					// [selectorLine] will not really be accurate for multi-line
					// selectors, such as "bar" in "foo,\nbar {}".
					contextSelectorSet.set(selector, selectorLine);
				}
			} else {
				contextSelectorSet.set(sortedSelectorList, selectorLine);
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
