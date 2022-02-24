'use strict';

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
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'media-feature-name-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/media-feature-name-disallowed-list',
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

				if (!matchesStringOrRegExp(value, primary)) {
					return;
				}

				const index = atRuleParamIndex(atRule) + sourceIndex;
				const endIndex = index + value.length;

				report({
					index,
					endIndex,
					message: messages.rejected(value),
					node: atRule,
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
