'use strict';

const { isMediaFeature, isMediaQueryInvalid } = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const { mediaFeatureNames } = require('../../reference/mediaFeatures');
const optionsMatches = require('../../utils/optionsMatches');
const parseMediaQuery = require('../../utils/parseMediaQuery');
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
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (!isMediaFeature(node)) return;

					const featureName = node.getName();

					if (!isStandardSyntaxMediaFeatureName(featureName) || isCustomMediaQuery(featureName)) {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignoreMediaFeatureNames', featureName)) {
						return;
					}

					if (vendor.prefix(featureName) || mediaFeatureNames.has(featureName.toLowerCase())) {
						return;
					}

					const [, , startIndex, endIndex] = node.getNameToken();
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
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
