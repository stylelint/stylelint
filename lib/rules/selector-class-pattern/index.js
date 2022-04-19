'use strict';

const isKeyframeSelector = require('../../utils/isKeyframeSelector');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolveNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isBoolean, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-class-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selectorValue, pattern) =>
		`Expected class selector ".${selectorValue}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-class-pattern',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isRegExp, isString],
			},
			{
				actual: secondaryOptions,
				possible: {
					resolveNestedSelectors: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {boolean} */
		const shouldResolveNestedSelectors =
			secondaryOptions && secondaryOptions.resolveNestedSelectors;
		/** @type {RegExp} */
		const normalizedPattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkRules((ruleNode) => {
			const selector = ruleNode.selector;
			const selectors = ruleNode.selectors;

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (selectors.some((s) => isKeyframeSelector(s))) {
				return;
			}

			// Only bother resolving selectors that have an interpolating &
			if (shouldResolveNestedSelectors && hasInterpolatingAmpersand(selector)) {
				for (const nestedSelector of resolveNestedSelector(selector, ruleNode)) {
					if (!isStandardSyntaxSelector(nestedSelector)) {
						continue;
					}

					parseSelector(nestedSelector, result, ruleNode, (s) => checkSelector(s, ruleNode));
				}
			} else {
				parseSelector(selector, result, ruleNode, (s) => checkSelector(s, ruleNode));
			}
		});

		/**
		 * @param {import('postcss-selector-parser').Root} fullSelector
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(fullSelector, ruleNode) {
			fullSelector.walkClasses((classNode) => {
				const value = classNode.value;
				const sourceIndex = classNode.sourceIndex;

				if (normalizedPattern.test(value)) {
					return;
				}

				report({
					result,
					ruleName,
					message: messages.expected(value, primary),
					node: ruleNode,
					index: sourceIndex,
				});
			});
		}
	};
};

/**
 * An "interpolating ampersand" means an "&" used to interpolate
 * within another simple selector, rather than an "&" that
 * stands on its own as a simple selector.
 *
 * @param {string} selector
 * @returns {boolean}
 */
function hasInterpolatingAmpersand(selector) {
	for (const [i, char] of Array.from(selector).entries()) {
		if (char !== '&') {
			continue;
		}

		const prevChar = selector.charAt(i - 1);

		if (prevChar && !isCombinator(prevChar)) {
			return true;
		}

		const nextChar = selector.charAt(i + 1);

		if (nextChar && !isCombinator(nextChar)) {
			return true;
		}
	}

	return false;
}

/**
 * @param {string} x
 * @returns {boolean}
 */
function isCombinator(x) {
	return /[\s+>~]/.test(x);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
