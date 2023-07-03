'use strict';

const { sourceIndices } = require('@csstools/css-parser-algorithms');
const {
	isMediaQueryInvalid,
	isMediaFeature,
	isMediaFeatureValue,
} = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const parseMediaQuery = require('../../utils/parseMediaQuery');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString, isRegExp } = require('../../utils/validateTypes');

const ruleName = 'media-feature-name-value-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name, value) => `Unexpected value "${value}" for name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-value-allowed-list',
};

/** @type {import('stylelint').Rule<Record<string, string | RegExp | Array<string | RegExp>>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString, isRegExp)],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			parseMediaQuery(atRule).forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				const initialState = {
					mediaFeatureName: '',
					unprefixedMediaFeatureName: '',
				};

				mediaQuery.walk(({ node, state }) => {
					if (!state) return;

					if (isMediaFeature(node)) {
						state.mediaFeatureName = node.getName();
						state.unprefixedMediaFeatureName = vendor.unprefixed(node.getName());

						return;
					}

					if (!isMediaFeatureValue(node)) return;

					const { mediaFeatureName, unprefixedMediaFeatureName } = state;

					if (!mediaFeatureName || !unprefixedMediaFeatureName) return;

					const componentValues = [node.value].flat();
					const value = componentValues.map((x) => x.toString()).join('');

					const allowedValuesKey = Object.keys(primary).find((featureName) =>
						matchesStringOrRegExp(unprefixedMediaFeatureName, featureName),
					);

					if (allowedValuesKey == null) {
						return;
					}

					if (optionsMatches(primary, allowedValuesKey, value)) {
						return;
					}

					const atRuleIndex = atRuleParamIndex(atRule);
					const [startIndex, endIndex] = sourceIndices(componentValues);

					report({
						index: atRuleIndex + startIndex,
						endIndex: atRuleIndex + endIndex + 1,
						message: messages.rejected,
						messageArgs: [mediaFeatureName, value],
						node: atRule,
						ruleName,
						result,
					});
				}, initialState);
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
