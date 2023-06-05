'use strict';

const { TokenType, tokenize, NumberType } = require('@csstools/css-tokenizer');
const {
	isTokenNode,
	isFunctionNode,
	parseCommaSeparatedListOfComponentValues,
	isSimpleBlockNode,
} = require('@csstools/css-parser-algorithms');
const { parseFromTokens, isMediaFeature } = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const hasDimension = require('../../utils/hasDimension');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');
const isUnicodeRangeDescriptor = require('../../utils/isUnicodeRangeDescriptor');

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
				possible: [isString],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [isString, isRegExp],
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
					ignoreMediaFeatureNames: [validateObjectWithArrayProps(isString, isRegExp)],
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
			if (!isFunctionNode(componentValue)) {
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
			if (!isTokenNode(componentValue)) return;

			if (componentValue.value[0] !== TokenType.Dimension) return;

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

			parseFromTokens(tokenizeWithoutPercentageTokens(params)).forEach((mediaQuery) => {
				/** @type {{ mediaFeatureName: string | undefined }} */
				const state = {
					mediaFeatureName: undefined,
				};

				mediaQuery.walk((entry) => {
					if (!entry.state) return;

					if (isMediaFeature(entry.node)) {
						entry.state.mediaFeatureName = entry.node.getName().toLowerCase();
					}

					if (!entry.state.mediaFeatureName) return;

					if (!isTokenNode(entry.node)) return;

					check(
						atRule,
						atRuleParamIndex,
						entry.node,
						entry.state.mediaFeatureName,
						secondaryOptions?.ignoreMediaFeatureNames,
					);
				}, state);
			});
		});
		root.walkDecls((decl) => {
			if (isUnicodeRangeDescriptor(decl)) return;

			const value = getDeclarationValue(decl);

			if (!hasDimension(value)) return;

			parseCommaSeparatedListOfComponentValues(tokenize({ css: value }))
				.flatMap((x) => x)
				.forEach((componentValue) => {
					if (isTokenNode(componentValue)) {
						check(
							decl,
							declarationValueIndex,
							componentValue,
							decl.prop,
							secondaryOptions?.ignoreProperties,
						);

						return;
					}

					if (!isFunctionNode(componentValue) && !isSimpleBlockNode(componentValue)) return;

					const state = {
						ignored: componentValueIsIgnored(componentValue),
					};

					componentValue.walk((entry) => {
						if (!entry.state) return;

						if (entry.state.ignored) return;

						if (isTokenNode(entry.node)) {
							check(
								decl,
								declarationValueIndex,
								entry.node,
								decl.prop,
								secondaryOptions?.ignoreProperties,
							);

							return;
						}

						if (componentValueIsIgnored(entry.node)) {
							entry.state.ignored = true;
						}
					}, state);
				});
		});
	};
};

/**
 * @param {string} value
 * @returns {Array<import('@csstools/css-tokenizer').CSSToken>}
 */
function tokenizeWithoutPercentageTokens(value) {
	return tokenize({ css: value }).map((x) => {
		if (x[0] !== TokenType.Percentage) return x;

		// Percentage values are not valid in media queries, so we can't parse them and get something valid back.
		// Dimension tokens with a unit of "%" work just fine.
		return [
			TokenType.Dimension,
			x[1],
			x[2],
			x[3],
			{ value: x[4].value, unit: '%', type: NumberType.Number },
		];
	});
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
