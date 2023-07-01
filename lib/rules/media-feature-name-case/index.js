'use strict';

const { mutateIdent } = require('@csstools/css-tokenizer');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const findMediaFeatureNames = require('../../utils/findMediaFeatureNames');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-name-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-case',
	fixable: true,
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['lower', 'upper'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			let hasComments = atRule.raws.params?.raw;
			let mediaRule = hasComments ? hasComments : atRule.params;

			let hasFixes = false;

			mediaRule = findMediaFeatureNames(mediaRule, (mediaFeatureNameToken) => {
				const [, , startIndex, endIndex, { value: featureName }] = mediaFeatureNameToken;

				if (isCustomMediaQuery(featureName)) {
					return;
				}

				const expectedFeatureName =
					primary === 'lower' ? featureName.toLowerCase() : featureName.toUpperCase();

				if (featureName === expectedFeatureName) {
					return;
				}

				if (context.fix) {
					mutateIdent(mediaFeatureNameToken, expectedFeatureName);
					hasFixes = true;

					return;
				}

				const atRuleIndex = atRuleParamIndex(atRule);

				report({
					message: messages.expected(featureName, expectedFeatureName),
					node: atRule,
					index: atRuleIndex + startIndex,
					endIndex: atRuleIndex + endIndex + 1,
					ruleName,
					result,
				});
			}).stringify();

			if (hasFixes) {
				if (hasComments) {
					if (atRule.raws.params == null) {
						throw new Error('The `AtRuleRaws` node must have a `params` property');
					}

					atRule.raws.params.raw = mediaRule;
				} else {
					atRule.params = mediaRule;
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
