'use strict';

const {
	isMediaFeature,
	isMediaQueryInvalid,
	isGeneralEnclosed,
} = require('@csstools/media-query-list-parser');
const { TokenType, isToken } = require('@csstools/css-tokenizer');
const { isTokenNode } = require('@csstools/css-parser-algorithms');

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

const rangeFeatureOperator = /[<>=]/;

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

		/**
		 * @param {import('postcss').AtRule} atRule
		 * @param {string} featureName
		 * @param {number} startIndex
		 * @param {number} endIndex
		 */
		const validateFeatureName = (atRule, featureName, startIndex, endIndex) => {
			if (!isStandardSyntaxMediaFeatureName(featureName) || isCustomMediaQuery(featureName)) {
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
		};

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (isMediaFeature(node)) {
						const [, , startIndex, endIndex] = node.getNameToken();

						validateFeatureName(atRule, node.getName(), startIndex, endIndex);

						return;
					}

					if (isGeneralEnclosed(node)) {
						const relevantTokens = topLevelTokenNodes(node);

						if (!relevantTokens) {
							return;
						}

						relevantTokens.forEach((token, i) => {
							if (token[0] !== TokenType.Ident) {
								return;
							}

							const nextToken = relevantTokens[i + 1];
							const prevToken = relevantTokens[i - 1];

							if (
								// Media Feature
								(!prevToken && nextToken && nextToken[0] === TokenType.Colon) ||
								// Range Feature
								(nextToken &&
									nextToken[0] === TokenType.Delim &&
									rangeFeatureOperator.test(nextToken[4].value)) ||
								// Range Feature
								(prevToken &&
									prevToken[0] === TokenType.Delim &&
									rangeFeatureOperator.test(prevToken[4].value))
							) {
								const [, , startIndex, endIndex, { value: featureName }] = token;

								validateFeatureName(atRule, featureName, startIndex, endIndex);
							}
						});
					}
				});
			});
		});
	};
};

/** @param {import('@csstools/media-query-list-parser').GeneralEnclosed} node */
function topLevelTokenNodes(node) {
	const components = node.value.value;

	if (isToken(components) || components.length === 0 || isToken(components[0])) {
		return false;
	}

	/** @type {Array<import('@csstools/css-tokenizer').CSSToken>} */
	const relevantTokens = [];

	// To consume the next token if it is a scss variable
	let lastWasDollarSign = false;

	components.forEach((component) => {
		// Only preserve top level tokens (idents, delims, ...)
		// Discard all blocks, functions, ...
		if (component && isTokenNode(component)) {
			if (component.value[0] === TokenType.Delim && component.value[4].value === '$') {
				lastWasDollarSign = true;

				return;
			}

			if (lastWasDollarSign) {
				lastWasDollarSign = false;

				return;
			}

			relevantTokens.push(component.value);
		}
	});

	return relevantTokens;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
