// @ts-nocheck

'use strict';

const _ = require('lodash');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const mediaParser = require('postcss-media-query-parser').default;
const rangeContextNodeParser = require('../rangeContextNodeParser');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-name-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
});

function rule(blacklist) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: blacklist,
			possible: [_.isString, _.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			mediaParser(atRule.params).walk(/^media-feature$/i, (mediaFeatureNode) => {
				const parent = mediaFeatureNode.parent;
				const mediaFeatureRangeContext = isRangeContextMediaFeature(parent.value);

				let value;
				let sourceIndex;

				if (mediaFeatureRangeContext) {
					const parsedRangeContext = rangeContextNodeParser(mediaFeatureNode);

					value = parsedRangeContext.name.value;
					sourceIndex = parsedRangeContext.name.sourceIndex;
				} else {
					value = mediaFeatureNode.value;
					sourceIndex = mediaFeatureNode.sourceIndex;
				}

				if (!isStandardSyntaxMediaFeatureName(value) || isCustomMediaQuery(value)) {
					return;
				}

				if (!matchesStringOrRegExp(value, blacklist)) {
					return;
				}

				report({
					index: atRuleParamIndex(atRule) + sourceIndex,
					message: messages.rejected(value),
					node: atRule,
					ruleName,
					result,
				});
			});
		});
	};
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
