'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const findFontFamily = require('../../utils/findFontFamily');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isVariable = require('../../utils/isVariable');
const { systemFontKeywords, fontFamilyKeywords } = require('../../reference/keywords');
const optionsMatches = require('../../utils/optionsMatches');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isAtRule } = require('../../utils/typeGuards');
const { isRegExp, isString, assert } = require('../../utils/validateTypes');

const ruleName = 'font-family-no-missing-generic-family-keyword';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected missing generic font family',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/font-family-no-missing-generic-family-keyword',
};

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
const isFamilyNameKeyword = (node) =>
	!('quote' in node) && fontFamilyKeywords.has(node.value.toLowerCase());

/**
 * @param {string} value
 * @returns {boolean}
 */
const isLastFontFamilyVariable = (value) => {
	const lastValue = postcss.list.comma(value).pop();

	return lastValue != null && (isVariable(lastValue) || !isStandardSyntaxValue(lastValue));
};

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
					ignoreFontFamilies: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^font(-family)?$/i, (decl) => {
			// Ignore @font-face
			const parent = decl.parent;

			if (parent && isAtRule(parent) && parent.name.toLowerCase() === 'font-face') {
				return;
			}

			if (decl.prop === 'font' && systemFontKeywords.has(decl.value.toLowerCase())) {
				return;
			}

			if (isLastFontFamilyVariable(decl.value)) {
				return;
			}

			const fontFamilies = findFontFamily(decl.value);

			if (fontFamilies.length === 0) {
				return;
			}

			if (fontFamilies.some((node) => isFamilyNameKeyword(node))) {
				return;
			}

			if (
				fontFamilies.some((node) =>
					optionsMatches(secondaryOptions, 'ignoreFontFamilies', node.value),
				)
			) {
				return;
			}

			const lastFontFamily = fontFamilies[fontFamilies.length - 1];

			assert(lastFontFamily);

			const valueIndex = declarationValueIndex(decl);
			const index = valueIndex + lastFontFamily.sourceIndex;
			const endIndex = valueIndex + lastFontFamily.sourceEndIndex;

			report({
				result,
				ruleName,
				message: messages.rejected,
				node: decl,
				index,
				endIndex,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
