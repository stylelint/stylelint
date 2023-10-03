'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const validateTypes = require('../../utils/validateTypes.cjs');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseMediaQuery = require('../../utils/parseMediaQuery.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

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
			possible: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			parseMediaQuery(atRule).forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) return;

				const initialState = {
					mediaFeatureName: '',
					unprefixedMediaFeatureName: '',
				};

				mediaQuery.walk(({ node, state }) => {
					if (!state) return;

					if (mediaQueryListParser.isMediaFeature(node)) {
						state.mediaFeatureName = node.getName();
						state.unprefixedMediaFeatureName = vendor.unprefixed(node.getName());

						return;
					}

					if (!mediaQueryListParser.isMediaFeatureValue(node)) return;

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
					const [startIndex, endIndex] = cssParserAlgorithms.sourceIndices(componentValues);

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