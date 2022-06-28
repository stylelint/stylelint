'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const transformSelector = require('../../utils/transformSelector');

const ruleName = 'keyframe-selector-notation';

const messages = ruleMessages(ruleName, {
	expected: (selector, fixedSelector) => `Expected "${selector}" to be "${fixedSelector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/keyframe-selector-notation',
	fixable: true,
};

const PERCENTAGE_SELECTORS = new Set(['0%', '100%']);
const KEYWORD_SELECTORS = new Set(['from', 'to']);

/** @type {import('stylelint').Rule<'keyword' | 'percentage'>} */
const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['keyword', 'percentage'],
		});

		if (!validOptions) return;

		/**
		 * @type {Record<primary, {
		 *   expFunc: (selector: string) => boolean,
		 *   fixFunc: (selector: string) => string,
		 * }>}
		 */
		const optionFuncs = Object.freeze({
			keyword: {
				expFunc: (selector) => KEYWORD_SELECTORS.has(selector),
				fixFunc: (selector) => {
					return selector === '0%' ? 'from' : 'to';
				},
			},
			percentage: {
				expFunc: (selector) => PERCENTAGE_SELECTORS.has(selector),
				fixFunc: (selector) => {
					return selector === 'from' ? '0%' : '100%';
				},
			},
		});

		root.walkAtRules(/^(-(moz|webkit)-)?keyframes$/i, (atRuleKeyframes) => {
			atRuleKeyframes.walkRules((keyframeRule) => {
				transformSelector(result, keyframeRule, (selectors) => {
					selectors.walkTags((selectorTag) => {
						checkSelector(
							selectorTag.value,
							(fixedSelector) => (selectorTag.value = fixedSelector),
						);
					});
				});

				/**
				 * @param {string} selector
				 * @param {(fixedSelector: string) => string} fixer
				 */
				function checkSelector(selector, fixer) {
					const normalizedSelector = selector.toLowerCase();

					if (
						!KEYWORD_SELECTORS.has(normalizedSelector) &&
						!PERCENTAGE_SELECTORS.has(normalizedSelector)
					) {
						return;
					}

					if (optionFuncs[primary].expFunc(selector)) return;

					const fixedSelector = optionFuncs[primary].fixFunc(selector);

					if (context.fix) {
						fixer(fixedSelector);

						return;
					}

					report({
						message: messages.expected(selector, fixedSelector),
						node: keyframeRule,
						result,
						ruleName,
						word: selector,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
