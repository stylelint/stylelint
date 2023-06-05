'use strict';

const { tokenize, TokenType } = require('@csstools/css-tokenizer');
const {
	parseCommaSeparatedListOfComponentValues,
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
} = require('@csstools/css-parser-algorithms');
const { isMediaFeature, parseFromTokens } = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const hasDimension = require('../../utils/hasDimension');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isUnicodeRangeDescriptor = require('../../utils/isUnicodeRangeDescriptor');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');
const { units } = require('../../reference/units');

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
					ignoreUnits: [isString, isRegExp],
					ignoreFunctions: [isString, isRegExp],
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

			const tokens = tokenize({ css: value });
			const hasUnknownUnits = tokens.some((token) => {
				return token[0] === TokenType.Dimension && !units.has(token[4].unit.toLowerCase());
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
			if (isFunctionNode(componentValue)) {
				const name = componentValue.getName();

				if (
					name.toLowerCase() === 'url' ||
					optionsMatches(secondaryOptions, 'ignoreFunctions', name)
				) {
					state.ignored = true;

					return;
				}

				if (
					vendor.unprefixed(name.toLowerCase()) === 'image-set' ||
					optionsMatches(secondaryOptions, 'ignoreFunctions', name)
				) {
					state.allowX = true;

					return;
				}

				return;
			}

			const [tokenType, , , endIndex, tokenValue] = componentValue.value;

			if (tokenType !== TokenType.Dimension) return;

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

			parseFromTokens(tokens).forEach((mediaQuery) => {
				const state = {
					ignored: false,
					allowX: false,
				};

				mediaQuery.walk((entry) => {
					if (!entry.state) return;

					if (entry.state.ignored) return;

					if (isMediaFeature(entry.node)) {
						const name = entry.node.getName();

						if (RESOLUTION_MEDIA_FEATURE_NAME.test(name)) {
							entry.state.allowX = true;
						}
					} else if (isFunctionNode(entry.node) || isTokenNode(entry.node)) {
						check(atRule, atRuleParamIndex, entry.node, entry.state);
					}
				}, state);
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

			parseCommaSeparatedListOfComponentValues(tokens)
				.flatMap((x) => x)
				.forEach((componentValue) => {
					const state = {
						ignored: false,
						allowX: isImageResolutionProp,
					};

					if (isFunctionNode(componentValue) || isTokenNode(componentValue)) {
						check(decl, declarationValueIndex, componentValue, state);
					}

					if (!isFunctionNode(componentValue) && !isSimpleBlockNode(componentValue)) {
						return;
					}

					componentValue.walk((entry) => {
						if (!entry.state) return;

						if (entry.state.ignored) return;

						if (isFunctionNode(entry.node) || isTokenNode(entry.node)) {
							check(decl, declarationValueIndex, entry.node, entry.state);
						}
					}, state);
				});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
