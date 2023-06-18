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
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const { isNumber, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'number-max-precision';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/number-max-precision',
};

/** @type {import('stylelint').Rule} */
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
					insideFunctions: [validateObjectWithArrayProps(isNumber)],
				},
			},
		);

		if (!validOptions) {
			return;
		}

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
				/** @type {{ ignored: boolean, precision: number }} */
				const state = {
					ignored: false,
					precision: primary,
				};

				walker(node, getIndex, componentValue, state);

				if (isFunctionNode(componentValue) || isSimpleBlockNode(componentValue)) {
					componentValue.walk((entry) => {
						if (!entry.state) return;

						if (entry.state.ignored) return;

						walker(node, getIndex, entry.node, entry.state);
					}, state);
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
			if (functionName in secondaryOptions.insideFunctions) {
				return secondaryOptions.insideFunctions[functionName];
			}

			for (const [name, precision] of Object.entries(secondaryOptions.insideFunctions)) {
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
