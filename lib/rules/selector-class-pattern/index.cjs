'use strict';

const resolveNestedSelector = require('postcss-resolve-nested-selector');
const validateTypes = require('../../utils/validateTypes.cjs');
const isKeyframeSelector = require('../../utils/isKeyframeSelector.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'selector-class-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selector, pattern) => `Expected "${selector}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-class-pattern',
};

/** @type {import('stylelint').Rule<string | RegExp, { resolveNestedSelector: boolean }>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [validateTypes.isRegExp, validateTypes.isString],
			},
			{
				actual: secondaryOptions,
				possible: {
					resolveNestedSelectors: [validateTypes.isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const shouldResolveNestedSelectors = Boolean(
			secondaryOptions && secondaryOptions.resolveNestedSelectors,
		);

		const normalizedPattern = validateTypes.isString(primary) ? new RegExp(primary) : primary;

		root.walkRules((ruleNode) => {
			const { selector, selectors } = ruleNode;

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
		 * @param {import('postcss-selector-parser').Root} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			selectorNode.walkClasses((classNode) => {
				const { value, sourceIndex: index } = classNode;

				if (normalizedPattern.test(value)) {
					return;
				}

				const selector = String(classNode);

				// `selector` may be resolved. So, getting its raw value may be pretty hard.
				// It means `endIndex` may be inaccurate (though non-standard selectors).
				//
				// For example, given ".abc { &_x {} }".
				// Then, an expected raw `selector` is "&_x",
				// but, an actual `selector` is ".abc_x".
				// see #6234
				const endIndex = index + selector.length;

				report({
					result,
					ruleName,
					message: messages.expected,
					messageArgs: [selector, primary],
					node: ruleNode,
					index,
					endIndex,
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