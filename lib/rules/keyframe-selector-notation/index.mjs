import { keyframeSelectorKeywords, namedTimelineRangeKeywords } from '../../reference/keywords.mjs';
import { assertString } from '../../utils/validateTypes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import transformSelector from '../../utils/transformSelector.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'keyframe-selector-notation';

const messages = ruleMessages(ruleName, {
	expected: (selector, fixedSelector) => `Expected "${selector}" to be "${fixedSelector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/keyframe-selector-notation',
	fixable: true,
};

const PERCENTAGE_SELECTORS = new Set(['0%', '100%']);

const PERCENTAGE_TO_KEYWORD = new Map([
	['0%', 'from'],
	['100%', 'to'],
]);

const KEYWORD_TO_PERCENTAGE = new Map([
	['from', '0%'],
	['to', '100%'],
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['keyword', 'percentage', 'percentage-unless-within-keyword-only-block'],
		});

		if (!validOptions) return;

		/**
		 * @typedef {{
		 *   expFunc: (selector: string, selectorsInBlock: string[]) => boolean,
		 *   fixFunc: (selector: string) => string,
		 * }} OptionFuncs
		 *
		 * @type {Record<primary, OptionFuncs>}
		 */
		const optionFuncs = Object.freeze({
			keyword: {
				expFunc: (selector) => keyframeSelectorKeywords.has(selector),
				fixFunc: (selector) => getFromMap(PERCENTAGE_TO_KEYWORD, selector),
			},
			percentage: {
				expFunc: (selector) => PERCENTAGE_SELECTORS.has(selector),
				fixFunc: (selector) => getFromMap(KEYWORD_TO_PERCENTAGE, selector),
			},
			'percentage-unless-within-keyword-only-block': {
				expFunc: (selector, selectorsInBlock) => {
					if (selectorsInBlock.every((s) => keyframeSelectorKeywords.has(s))) return true;

					return PERCENTAGE_SELECTORS.has(selector);
				},
				fixFunc: (selector) => getFromMap(KEYWORD_TO_PERCENTAGE, selector),
			},
		});

		root.walkAtRules(/^(-(o|moz|ms|webkit)-)?keyframes$/i, (atRuleKeyframes) => {
			const selectorsInBlock =
				primary === 'percentage-unless-within-keyword-only-block'
					? getSelectorsInBlock(atRuleKeyframes)
					: [];

			atRuleKeyframes.walkRules((keyframeRule) => {
				transformSelector(result, keyframeRule, (selectors) => {
					let first = true;

					selectors.walkTags((selectorTag) => {
						if (first && namedTimelineRangeKeywords.has(selectorTag.value)) {
							return false;
						}

						first = false;

						checkSelector(selectorTag, optionFuncs[primary]);
					});
				});

				/**
				 * @param {import('postcss-selector-parser').Tag} tag
				 * @param {OptionFuncs} funcs
				 */
				function checkSelector(tag, { expFunc, fixFunc }) {
					const selector = tag.value;
					const normalizedSelector = selector.toLowerCase();

					if (
						!keyframeSelectorKeywords.has(normalizedSelector) &&
						!PERCENTAGE_SELECTORS.has(normalizedSelector)
					) {
						return;
					}

					if (expFunc(selector, selectorsInBlock)) return;

					const fixedSelector = fixFunc(selector);

					report({
						message: messages.expected,
						messageArgs: [selector, fixedSelector],
						node: keyframeRule,
						result,
						ruleName,
						word: selector,
						fix: () => {
							tag.value = fixedSelector;
						},
					});
				}
			});
		});
	};
};

/**
 * @param {Map<string, string>} map
 * @param {string} key
 * @returns {string}
 */
function getFromMap(map, key) {
	const value = map.get(key);

	assertString(value);

	return value;
}

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string[]}
 */
function getSelectorsInBlock(atRule) {
	/** @type {string[]} */
	const selectors = [];

	atRule.walkRules((r) => {
		selectors.push(...r.selectors);
	});

	return selectors;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
