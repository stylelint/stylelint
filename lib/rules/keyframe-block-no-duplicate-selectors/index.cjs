// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const regexes = require('../../utils/regexes.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const getStrippedSelectorSource = require('../../utils/getStrippedSelectorSource.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'keyframe-block-no-duplicate-selectors';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected duplicate "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/keyframe-block-no-duplicate-selectors',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(regexes.atRulesRegexes.keyframes, (atRuleKeyframes) => {
			const selectors = new Set();

			atRuleKeyframes.walkRules((keyframeRule) => {
				if (!isStandardSyntaxRule(keyframeRule)) {
					return;
				}

				parseSelector(getRuleSelector(keyframeRule), result, keyframeRule)?.each((selector) => {
					const { selector: selectorStr, index, endIndex } = getStrippedSelectorSource(selector);

					const normalizedSelector = selectorStr.toLowerCase();

					const isDuplicate = selectors.has(normalizedSelector);

					if (isDuplicate) {
						report({
							message: messages.rejected,
							messageArgs: [selectorStr],
							node: keyframeRule,
							result,
							ruleName,
							index,
							endIndex,
						});

						return;
					}

					selectors.add(normalizedSelector);
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
