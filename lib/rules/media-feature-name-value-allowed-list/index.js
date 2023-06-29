'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const { isString, isRegExp } = require('../../utils/validateTypes');
const vendor = require('../../utils/vendor');
const {
	parseFromTokens,
	isMediaQueryInvalid,
	isMediaFeature,
	isMediaFeatureValue,
} = require('@csstools/media-query-list-parser');
const { TokenType, tokenize } = require('@csstools/css-tokenizer');
const getAtRuleParams = require('../../utils/getAtRuleParams');

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
			parseFromTokens(
				normalizeTokenStream(
					tokenize({
						css: getAtRuleParams(atRule),
					}),
				),
			).forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(
					(entry) => {
						if (!entry.state) return;

						if (isMediaFeature(entry.node)) {
							entry.state.mediaFeatureName = vendor.unprefixed(entry.node.getName());
							entry.state.unprefixedMediaFeatureName = vendor.unprefixed(entry.node.getName());

							return;
						}

						if (!isMediaFeatureValue(entry.node)) return;

						if (!entry.state.mediaFeatureName || !entry.state.unprefixedMediaFeatureName) return;

						const mediaFeatureName = entry.state.mediaFeatureName;
						const unprefixedMediaFeatureName = entry.state.unprefixedMediaFeatureName;

						const componentValues = [entry.node.value].flat();
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

						const valueStartIndex = componentValues[0]?.tokens()[0]?.[2] ?? 0;

						const index = atRuleParamIndex(atRule) + valueStartIndex;
						const endIndex = index + value.length;

						report({
							index,
							endIndex,
							message: messages.rejected,
							messageArgs: [mediaFeatureName, value],
							node: atRule,
							ruleName,
							result,
						});
					},
					{
						mediaFeatureName: '',
						unprefixedMediaFeatureName: '',
					},
				);
			});
		});
	};
};

/**
 * Convert <ident><full_stop><function> to <function> to support scss name spacing
 *
 * @param {Array<import('@csstools/css-tokenizer').CSSToken>} tokens
 * @returns {Array<import('@csstools/css-tokenizer').CSSToken>}
 */
function normalizeTokenStream(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (!token || token[0] !== TokenType.Delim || token[4].value !== '$') continue;

		const tokenPlus1 = tokens[i + 1];

		if (!tokenPlus1 || tokenPlus1[0] !== TokenType.Ident) continue;

		tokens.splice(i, 2, [
			TokenType.Ident,
			token[1] + tokenPlus1[1],
			token[2],
			tokenPlus1[3],
			{
				value: token[4].value + tokenPlus1[4].value,
			},
		]);
	}

	return tokens;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
