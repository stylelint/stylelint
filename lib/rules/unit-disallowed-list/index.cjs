'use strict';

const cssTokenizer = require('@csstools/css-tokenizer');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const mediaQueryListParser = require('@csstools/media-query-list-parser');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const getAtRuleParams = require('../../utils/getAtRuleParams.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const hasDimension = require('../../utils/hasDimension.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const isUnicodeRangeDescriptor = require('../../utils/isUnicodeRangeDescriptor.cjs');

const ruleName = 'unit-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unit-disallowed-list',
};

/** @type {import('stylelint').Rule<string | string[]>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [validateTypes.isString],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [validateTypes.isString, validateTypes.isRegExp],
					ignoreProperties: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
					ignoreMediaFeatureNames: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		const primaryValues = [primary].flat();

		/**
		 * Ignore wrong units within `url` function
		 * Ignore units within function that match `ignoreFunctions` option
		 *
		 * @param {import('@csstools/css-parser-algorithms').ComponentValue} componentValue
		 * @returns {boolean}
		 */
		function componentValueIsIgnored(componentValue) {
			if (!cssParserAlgorithms.isFunctionNode(componentValue)) {
				return false;
			}

			const name = componentValue.getName().toLowerCase();

			return name === 'url' || optionsMatches(secondaryOptions, 'ignoreFunctions', name);
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {(node: T) => number} getIndex
		 * @param {import('@csstools/css-parser-algorithms').ComponentValue} componentValue
		 * @param {string} input
		 * @param {Record<string, unknown> | undefined} options
		 * @returns {void}
		 */
		function check(node, getIndex, componentValue, input, options) {
			if (!cssParserAlgorithms.isTokenNode(componentValue)) return;

			if (componentValue.value[0] !== cssTokenizer.TokenType.Dimension) return;

			const [, , , endIndex, { unit }] = componentValue.value;

			const lowerCaseUnit = unit.toLowerCase();

			if (!primaryValues.includes(lowerCaseUnit)) {
				return;
			}

			// The unit has an ignore option for the specific input
			if (options && optionsMatches(options, lowerCaseUnit, input)) return;

			const startIndex = getIndex(node) + (endIndex + 1) - unit.length;

			report({
				index: startIndex,
				endIndex: startIndex + unit.length,
				message: messages.rejected,
				messageArgs: [unit],
				node,
				result,
				ruleName,
			});
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			const params = getAtRuleParams(atRule);

			if (!hasDimension(params)) return;

			mediaQueryListParser.parseFromTokens(tokenizeWithoutPercentages(params)).forEach((mediaQuery) => {
				/** @type {{ mediaFeatureName: string | undefined }} */
				const initialState = {
					mediaFeatureName: undefined,
				};

				mediaQuery.walk(({ node, state }) => {
					if (!state) return;

					if (mediaQueryListParser.isMediaFeature(node)) {
						state.mediaFeatureName = node.getName().toLowerCase();
					}

					if (!state.mediaFeatureName) return;

					if (!cssParserAlgorithms.isTokenNode(node)) return;

					check(
						atRule,
						atRuleParamIndex,
						node,
						state.mediaFeatureName,
						secondaryOptions?.ignoreMediaFeatureNames,
					);
				}, initialState);
			});
		});

		root.walkDecls((decl) => {
			if (isUnicodeRangeDescriptor(decl)) return;

			const value = getDeclarationValue(decl);

			if (!hasDimension(value)) return;

			cssParserAlgorithms.parseListOfComponentValues(tokenizeWithoutPercentages(value)).forEach((componentValue) => {
				if (cssParserAlgorithms.isTokenNode(componentValue)) {
					check(
						decl,
						declarationValueIndex,
						componentValue,
						decl.prop,
						secondaryOptions?.ignoreProperties,
					);

					return;
				}

				if (!cssParserAlgorithms.isFunctionNode(componentValue) && !cssParserAlgorithms.isSimpleBlockNode(componentValue)) return;

				const initialState = {
					ignored: componentValueIsIgnored(componentValue),
				};

				componentValue.walk(({ node, state }) => {
					if (!state) return;

					if (state.ignored) return;

					if (cssParserAlgorithms.isTokenNode(node)) {
						check(decl, declarationValueIndex, node, decl.prop, secondaryOptions?.ignoreProperties);

						return;
					}

					if (componentValueIsIgnored(node)) {
						state.ignored = true;
					}
				}, initialState);
			});
		});
	};
};

/**
 * In the CSS syntax percentages are a different token type than dimensions.
 * For CSS authors however this distinction doesn't make sense, so we convert
 * percentage tokens to dimension tokens with a unit of "%".
 *
 * Percentage tokens also aren't valid in media queries.
 * Converting percentage tokens to dimension tokens simplifies any code checking for units.
 *
 * @param {string} css
 * @returns {Array<import('@csstools/css-tokenizer').CSSToken>}
 */
function tokenizeWithoutPercentages(css) {
	return cssTokenizer.tokenize({ css }).map((x) => {
		if (x[0] !== cssTokenizer.TokenType.Percentage) return x;

		return [
			cssTokenizer.TokenType.Dimension,
			x[1],
			x[2],
			x[3],
			{ value: x[4].value, unit: '%', type: cssTokenizer.NumberType.Number },
		];
	});
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
