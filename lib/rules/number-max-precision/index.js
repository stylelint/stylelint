'use strict';

const { tokenize, TokenType } = require('@csstools/css-tokenizer');
const {
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	parseListOfComponentValues,
} = require('@csstools/css-parser-algorithms');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isNumber, isRegExp, isString } = require('../../utils/validateTypes');
const validateObjectWithProps = require('../../utils/validateObjectWithProps');

const ruleName = 'number-max-precision';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/number-max-precision',
};

/** @type {import('stylelint').Rule<number>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isNumber],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
					ignoreUnits: [isString, isRegExp],
					insideFunctions: [validateObjectWithProps(isNumber)],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {Map<string, number>} */
		const insideFunctions = new Map(Object.entries(secondaryOptions?.insideFunctions ?? {}));

		root.walkAtRules((atRule) => {
			if (atRule.name.toLowerCase() === 'import') {
				return;
			}

			check(atRule, atRuleParamIndex, getAtRuleParams(atRule));
		});

		root.walkDecls((decl) => {
			check(decl, declarationValueIndex, getDeclarationValue(decl));
		});

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {(node: T) => number} getIndex
		 * @param {string} value
		 */
		function check(node, getIndex, value) {
			// Get out quickly if there are no periods
			if (!value.includes('.')) {
				return;
			}

			const prop = 'prop' in node ? node.prop : undefined;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
				return;
			}

			parseListOfComponentValues(tokenize({ css: value })).forEach((componentValue) => {
				const initialState = {
					ignored: false,
					precision: primary,
				};

				walker(node, getIndex, componentValue, initialState);

				if (isFunctionNode(componentValue) || isSimpleBlockNode(componentValue)) {
					componentValue.walk(({ node: mediaNode, state }) => {
						if (!state) return;

						if (state.ignored) return;

						walker(node, getIndex, mediaNode, state);
					}, initialState);
				}
			});
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {(node: T) => number} getIndex
		 * @param {import('@csstools/css-parser-algorithms').ComponentValue} componentValue
		 * @param {{ ignored: boolean, precision: number }} state
		 */
		function walker(node, getIndex, componentValue, state) {
			if (isFunctionNode(componentValue)) {
				const name = componentValue.getName().toLowerCase();

				if (name === 'url') {
					// postcss-value-parser exposed url token contents as "word" tokens, these were indistinguishable from numeric values in any other function.
					// With @csstools/css-tokenizer this is no longer relevant, but we preserve the old condition to avoid breaking changes.
					state.ignored = true;

					return;
				}

				state.precision = precisionInsideFunction(name, state.precision);

				return;
			}

			if (!isTokenNode(componentValue)) {
				return;
			}

			const [tokenType, raw, startIndex, endIndex, parsedValue] = componentValue.value;

			if (
				tokenType !== TokenType.Number &&
				tokenType !== TokenType.Dimension &&
				tokenType !== TokenType.Percentage
			) {
				return;
			}

			let unitStringLength = 0;

			if (tokenType === TokenType.Dimension) {
				const unit = parsedValue.unit;

				unitStringLength = unit.length;

				if (optionsMatches(secondaryOptions, 'ignoreUnits', unit)) {
					return;
				}
			} else if (tokenType === TokenType.Percentage) {
				unitStringLength = 1;

				if (optionsMatches(secondaryOptions, 'ignoreUnits', '%')) {
					return;
				}
			}

			const match = /\d*\.(\d+)/.exec(raw);

			if (match == null || match[0] == null || match[1] == null) {
				return;
			}

			if (match[1].length <= state.precision) {
				return;
			}

			const nodeIndex = getIndex(node);

			report({
				result,
				ruleName,
				node,
				index: nodeIndex + startIndex,
				endIndex: nodeIndex + (endIndex + 1) - unitStringLength,
				message: messages.expected,
				messageArgs: [parsedValue.value, parsedValue.value.toFixed(state.precision)],
			});
		}

		/**
		 * @param {string} functionName
		 * @param {number} currentPrecision
		 * @returns {number}
		 */
		function precisionInsideFunction(functionName, currentPrecision) {
			const precisionForFunction = insideFunctions.get(functionName);

			if (isNumber(precisionForFunction)) return precisionForFunction;

			for (const [name, precision] of insideFunctions) {
				if (matchesStringOrRegExp(functionName, name)) {
					return precision;
				}
			}

			return currentPrecision;
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
