'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'keyframe-selector-notation';

const messages = ruleMessages(ruleName, {
	expected: (selector, fixedSelector) => `Expected "${selector}" to be "${fixedSelector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/keyframe-selector-notation',
};

const INTERCHANGEABLE_KEYFRAME_SELECTORS = new Set(['0%', '100%', 'from', 'to']);

/** @type {import('stylelint').Rule<'keyword' | 'percentage'>} */
const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['keyword', 'percentage'],
		});

		if (!validOptions) return;

		const optionFuncs = Object.freeze({
			keyword: {
				expFunc: isKeyframeSelectorKeyword,
				fixFunc: asKeyframeSelectorKeyword,
			},
			percentage: {
				expFunc: isKeyframeSelectorPercentage,
				fixFunc: asKeyframeSelectorPercentage,
			},
		});

		root.walkAtRules(/^(-(moz|webkit)-)?keyframes$/i, (atRuleKeyframes) => {
			atRuleKeyframes.walkRules((keyframeRule) => {
				const selector = keyframeRule.selector;

				const normalizedSelector = selector.toLowerCase();

				if (!INTERCHANGEABLE_KEYFRAME_SELECTORS.has(normalizedSelector)) {
					return;
				}

				/** @type {'keyword' | 'percentage'} */
				const expectation = primary;

				if (optionFuncs[expectation].expFunc(selector)) return;

				const fixedSelector = optionFuncs[expectation].fixFunc(selector);

				if (context.fix) {
					keyframeRule.selector = fixedSelector;

					return;
				}

				report({
					message: messages.expected(selector, fixedSelector),
					node: keyframeRule,
					result,
					ruleName,
					word: selector,
				});
			});
		});
	};
};

/**
 * @param {string} selector
 * @returns {string}
 */
function asKeyframeSelectorKeyword(selector) {
	return selector === '0%' ? 'from' : 'to';
}

/**
 * @param {string} selector
 * @returns {string}
 */
function asKeyframeSelectorPercentage(selector) {
	return selector === 'from' ? '0%' : '100%';
}

/**
 * @param {string} selector
 * @returns {boolean}
 */
function isKeyframeSelectorKeyword(selector) {
	return selector === 'from' || selector === 'to';
}

/**
 * @param {string} selector
 * @returns {boolean}
 */
function isKeyframeSelectorPercentage(selector) {
	return selector === '0%' || selector === '100%';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
