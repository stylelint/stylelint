'use strict';

const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'keyframe-block-no-duplicate-selectors';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected duplicate "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/keyframe-block-no-duplicate-selectors',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^(-(moz|webkit)-)?keyframes$/i, (atRuleKeyframes) => {
			const selectors = new Set();

			atRuleKeyframes.walkRules((keyframeRule) => {
				const ruleSelectors = keyframeRule.selectors;

				ruleSelectors.forEach((selector) => {
					if (!isStandardSyntaxSelector(selector)) {
						return;
					}

					const normalizedSelector = selector.toLowerCase();

					const isDuplicate = selectors.has(normalizedSelector);

					if (isDuplicate) {
						report({
							message: messages.rejected,
							messageArgs: [selector],
							node: keyframeRule,
							result,
							ruleName,
							word: selector,
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
