'use strict';

const cssTokenizer = require('@csstools/css-tokenizer');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const mediaQueryListParser = require('@csstools/media-query-list-parser');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const getAtRuleParams = require('../../utils/getAtRuleParams.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const hasDimension = require('../../utils/hasDimension.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration.cjs');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue.cjs');
const isUnicodeRangeDescriptor = require('../../utils/isUnicodeRangeDescriptor.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const units$1 = require('../../reference/units.cjs');

const units = new Set(units$1.units); // a copy that is safe to mutate

// `x` as a resolution unit is very often a typo for `px`.
// By removing it from the set of known units, we can catch those typos.
// Intentional `x` units are supported by manually checking these in specific functions or properties.
units.delete('x');

const ruleName = 'unit-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unknown unit "${unit}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unit-no-unknown',
};

const RESOLUTION_MEDIA_FEATURE_NAME = /^(?:min-|max-)?resolution$/i;

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
					ignoreUnits: [validateTypes.isString, validateTypes.isRegExp],
					ignoreFunctions: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {string} value
		 */
		const tokenizeIfValueMightContainUnknownUnits = (value) => {
			if (!hasDimension(value)) return;

			const tokens = cssTokenizer.tokenize({ css: value });
			const hasUnknownUnits = tokens.some((token) => {
				return token[0] === cssTokenizer.TokenType.Dimension && !units.has(token[4].unit.toLowerCase());
			});

			if (!hasUnknownUnits) return;

			return tokens;
		};

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {(node: T) => number} getIndex
		 * @param {import('@csstools/css-parser-algorithms').FunctionNode | import('@csstools/css-parser-algorithms').TokenNode} componentValue
		 * @param {{ ignored: boolean, allowX: boolean }} state
		 */
		const check = (node, getIndex, componentValue, state) => {
			if (cssParserAlgorithms.isFunctionNode(componentValue)) {
				const name = componentValue.getName();
				const nameLowerCase = name.toLowerCase();

				if (nameLowerCase === 'url' || optionsMatches(secondaryOptions, 'ignoreFunctions', name)) {
					state.ignored = true;

					return;
				}

				if (vendor.unprefixed(nameLowerCase) === 'image-set') {
					state.allowX = true;

					return;
				}

				return;
			}

			const [tokenType, , , endIndex, tokenValue] = componentValue.value;

			if (tokenType !== cssTokenizer.TokenType.Dimension) return;

			if (optionsMatches(secondaryOptions, 'ignoreUnits', tokenValue.unit)) return;

			const unit = tokenValue.unit.toLowerCase();

			if (unit === 'x' && state.allowX) return;

			if (units.has(unit) && unit !== 'x') return;

			const startIndex = getIndex(node) + (endIndex + 1) - unit.length;

			report({
				message: messages.rejected,
				messageArgs: [tokenValue.unit],
				node,
				index: startIndex,
				endIndex: startIndex + unit.length,
				result,
				ruleName,
			});
		};

		root.walkAtRules(/^media$/i, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const params = getAtRuleParams(atRule);

			const tokens = tokenizeIfValueMightContainUnknownUnits(params);

			if (!tokens) return;

			mediaQueryListParser.parseFromTokens(tokens).forEach((mediaQuery) => {
				const initialState = {
					ignored: false,
					allowX: false,
				};

				mediaQuery.walk(({ node, state }) => {
					if (!state) return;

					if (state.ignored) return;

					if (mediaQueryListParser.isMediaFeature(node)) {
						const name = node.getName();

						if (RESOLUTION_MEDIA_FEATURE_NAME.test(name)) {
							state.allowX = true;
						}
					} else if (cssParserAlgorithms.isFunctionNode(node) || cssParserAlgorithms.isTokenNode(node)) {
						check(atRule, atRuleParamIndex, node, state);
					}
				}, initialState);
			});
		});

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			if (isUnicodeRangeDescriptor(decl)) return;

			const value = getDeclarationValue(decl);

			if (!isStandardSyntaxValue(value)) return;

			const tokens = tokenizeIfValueMightContainUnknownUnits(value);

			if (!tokens) return;

			const isImageResolutionProp = decl.prop.toLowerCase() === 'image-resolution';

			cssParserAlgorithms.parseListOfComponentValues(tokens).forEach((componentValue) => {
				const initialState = {
					ignored: false,
					allowX: isImageResolutionProp,
				};

				if (cssParserAlgorithms.isFunctionNode(componentValue) || cssParserAlgorithms.isTokenNode(componentValue)) {
					check(decl, declarationValueIndex, componentValue, initialState);
				}

				if (!cssParserAlgorithms.isFunctionNode(componentValue) && !cssParserAlgorithms.isSimpleBlockNode(componentValue)) {
					return;
				}

				componentValue.walk(({ node, state }) => {
					if (!state) return;

					if (state.ignored) return;

					if (cssParserAlgorithms.isFunctionNode(node) || cssParserAlgorithms.isTokenNode(node)) {
						check(decl, declarationValueIndex, node, state);
					}
				}, initialState);
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
