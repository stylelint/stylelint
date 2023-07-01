'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const findMediaFeatureNames = require('../../utils/findMediaFeatureNames');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const { mediaFeatureNames } = require('../../reference/mediaFeatures');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'media-feature-name-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (mediaFeatureName) => `Unexpected unknown media feature name "${mediaFeatureName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-no-unknown',
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
					ignoreMediaFeatureNames: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			findMediaFeatureNames(getAtRuleParams(atRule), (mediaFeatureNameToken) => {
				const [, , startIndex, endIndex, { value: featureName }] = mediaFeatureNameToken;

				if (isCustomMediaQuery(featureName)) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignoreMediaFeatureNames', featureName)) {
					return;
				}

				if (vendor.prefix(featureName) || mediaFeatureNames.has(featureName.toLowerCase())) {
					return;
				}

				const atRuleIndex = atRuleParamIndex(atRule);

				report({
					message: messages.rejected,
					messageArgs: [featureName],
					node: atRule,
					index: atRuleIndex + startIndex,
					endIndex: atRuleIndex + endIndex + 1,
					ruleName,
					result,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
