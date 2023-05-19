'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const findMediaFeatureNames = require('../../utils/findMediaFeatureNames');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'media-feature-name-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-allowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			findMediaFeatureNames(getAtRuleParams(atRule), (mediaFeatureNameToken) => {
				const [, , startIndex, endIndex, { value: featureName }] = mediaFeatureNameToken;

				if (!isStandardSyntaxMediaFeatureName(featureName) || isCustomMediaQuery(featureName)) {
					return;
				}

				if (matchesStringOrRegExp(featureName, primary)) {
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

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
