'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const mediaParser = require('postcss-media-query-parser').default;
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-range-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected "${primary}" media feature range notation`,
});

//TODO: Need to Update
const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-range-notation',
	fixable: true,
};

const RANGE_TYPE_MEDIA_FEATURES = new Set([
	'width',
	'height',
	'aspect-ratio',
	'resolution',
	'color',
]);

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
			mediaParser(atRule.params).walk(/^media-feature$/i, (mediaFeatureNode) => {
				const { parent, value } = mediaFeatureNode;

				if (!isStandardSyntaxMediaFeatureName(value)) return;

				if (
					primary === 'prefix' &&
					(isPrefixedRangeMediaFeature(value) || !isRangeTypeMediaFeature(value))
				)
					return;

				if (
					primary === 'context' &&
					(isRangeContextMediaFeature(value) || !isRangeTypeMediaFeature(value))
				)
					return;

				const index = atRuleParamIndex(atRule) + parent.sourceIndex;
				const endIndex = index + value.parent.length;

				report({
					message: messages.expected(primary),
					node: atRule,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

function isPrefixedRangeMediaFeature(mediaFeature) {
	return mediaFeature.startsWith('min-') || mediaFeature.startsWith('max-');
}

function isRangeTypeMediaFeature(mediaFeature) {
	const unprefixedMediaFeature = mediaFeature.replace(/^(min|max)-/, '');
	return RANGE_TYPE_MEDIA_FEATURES.has(unprefixedMediaFeature);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
