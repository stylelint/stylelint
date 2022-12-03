'use strict';

const mediaParser = require('postcss-media-query-parser').default;

const { rangeTypeMediaFeatureNames } = require('../../reference/mediaFeatures.js');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const isStandardSyntaxMediaFeatureName = require('../../utils/isStandardSyntaxMediaFeatureName');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-range-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected "${primary}" media feature range notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-range-notation',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['prefix', 'context'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			mediaParser(atRule.params).walk(/^media-feature$/i, ({ parent, value }) => {
				if (!isStandardSyntaxMediaFeatureName(value)) return;

				if (!isRangeContextMediaFeature(value) && isInBooleanContext(parent)) return;

				if (!isRangeContextMediaFeature(value) && !isRangeTypeMediaFeature(value)) return;

				if (primary === 'prefix' && isPrefixedRangeMediaFeature(value)) return;

				if (primary === 'context' && isRangeContextMediaFeature(value)) return;

				const index = atRuleParamIndex(atRule) + parent.sourceIndex;
				const endIndex = index + parent.value.length;

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

/**
 * @param {string} mediaFeature
 */
function isPrefixedRangeMediaFeature(mediaFeature) {
	return mediaFeature.startsWith('min-') || mediaFeature.startsWith('max-');
}

/**
 * @param {string} mediaFeature
 */
function isRangeTypeMediaFeature(mediaFeature) {
	const unprefixedMediaFeature = mediaFeature.replace(/^(?:min|max)-/, '');

	return rangeTypeMediaFeatureNames.has(unprefixedMediaFeature);
}

/**
 * @param {import('postcss-media-query-parser').Node} mediaFeatureExpressionNode
 */
function isInBooleanContext({ nodes }) {
	return nodes && nodes.length === 1;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
