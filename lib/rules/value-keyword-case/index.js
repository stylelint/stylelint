'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const isCounterIncrementCustomIdentValue = require('../../utils/isCounterIncrementCustomIdentValue');
const isCounterResetCustomIdentValue = require('../../utils/isCounterResetCustomIdentValue');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const { isBoolean, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'value-keyword-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/value-keyword-case',
};

// Operators are interpreted as "words" by the value parser, so we want to make sure to ignore them.
const ignoredCharacters = new Set(['+', '-', '/', '*', '%']);
const gridRowProps = new Set(['grid-row', 'grid-row-start', 'grid-row-end']);
const gridColumnProps = new Set(['grid-column', 'grid-column-start', 'grid-column-end']);

const mapLowercaseKeywordsToCamelCase = new Map();

for (const func of keywordSets.camelCaseKeywords) {
	mapLowercaseKeywordsToCamelCase.set(func.toLowerCase(), func);
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['lower', 'upper'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
					ignoreKeywords: [isString, isRegExp],
					ignoreFunctions: [isString, isRegExp],
					camelCaseSvgKeywords: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const propLowerCase = decl.prop.toLowerCase();
			const value = decl.value;

			const parsed = valueParser(getDeclarationValue(decl));

			let needFix = false;

			parsed.walk((node) => {
				const valueLowerCase = node.value.toLowerCase();

				// Ignore system colors
				if (keywordSets.systemColors.has(valueLowerCase)) {
					return;
				}

				// Ignore keywords within `url` and `var` function
				if (
					node.type === 'function' &&
					(valueLowerCase === 'url' ||
						valueLowerCase === 'var' ||
						valueLowerCase === 'counter' ||
						valueLowerCase === 'counters' ||
						valueLowerCase === 'attr')
				) {
					return false;
				}

				// ignore keywords within ignoreFunctions functions

				if (
					node.type === 'function' &&
					optionsMatches(secondaryOptions, 'ignoreFunctions', valueLowerCase)
				) {
					return false;
				}

				const keyword = node.value;

				// Ignore css variables, and hex values, and math operators, and sass interpolation
				if (
					node.type !== 'word' ||
					!isStandardSyntaxValue(node.value) ||
					value.includes('#') ||
					ignoredCharacters.has(keyword) ||
					getUnitFromValueNode(node)
				) {
					return;
				}

				if (
					propLowerCase === 'animation' &&
					!keywordSets.animationShorthandKeywords.has(valueLowerCase) &&
					!keywordSets.animationNameKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (
					propLowerCase === 'animation-name' &&
					!keywordSets.animationNameKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (
					propLowerCase === 'font' &&
					!keywordSets.fontShorthandKeywords.has(valueLowerCase) &&
					!keywordSets.fontFamilyKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (
					propLowerCase === 'font-family' &&
					!keywordSets.fontFamilyKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (
					propLowerCase === 'counter-increment' &&
					isCounterIncrementCustomIdentValue(valueLowerCase)
				) {
					return;
				}

				if (propLowerCase === 'counter-reset' && isCounterResetCustomIdentValue(valueLowerCase)) {
					return;
				}

				if (gridRowProps.has(propLowerCase) && !keywordSets.gridRowKeywords.has(valueLowerCase)) {
					return;
				}

				if (
					gridColumnProps.has(propLowerCase) &&
					!keywordSets.gridColumnKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (propLowerCase === 'grid-area' && !keywordSets.gridAreaKeywords.has(valueLowerCase)) {
					return;
				}

				if (
					propLowerCase === 'list-style' &&
					!keywordSets.listStyleShorthandKeywords.has(valueLowerCase) &&
					!keywordSets.listStyleTypeKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (
					propLowerCase === 'list-style-type' &&
					!keywordSets.listStyleTypeKeywords.has(valueLowerCase)
				) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignoreKeywords', keyword)) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
					return;
				}

				const keywordLowerCase = keyword.toLocaleLowerCase();
				let expectedKeyword = null;

				/** @type {boolean} */
				const camelCaseSvgKeywords =
					(secondaryOptions && secondaryOptions.camelCaseSvgKeywords) || false;

				if (
					primary === 'lower' &&
					mapLowercaseKeywordsToCamelCase.has(keywordLowerCase) &&
					camelCaseSvgKeywords
				) {
					expectedKeyword = mapLowercaseKeywordsToCamelCase.get(keywordLowerCase);
				} else if (primary === 'lower') {
					expectedKeyword = keyword.toLowerCase();
				} else {
					expectedKeyword = keyword.toUpperCase();
				}

				if (keyword === expectedKeyword) {
					return;
				}

				if (context.fix) {
					needFix = true;
					node.value = expectedKeyword;

					return;
				}

				report({
					message: messages.expected(keyword, expectedKeyword),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});

			if (context.fix && needFix) {
				decl.value = parsed.toString();
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
