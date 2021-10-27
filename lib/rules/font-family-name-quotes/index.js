'use strict';

const findFontFamily = require('../../utils/findFontFamily');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isVariable = require('../../utils/isVariable');
const keywordSets = require('../../reference/keywordSets');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'font-family-name-quotes';

const messages = ruleMessages(ruleName, {
	expected: (family) => `Expected quotes around "${family}"`,
	rejected: (family) => `Unexpected quotes around "${family}"`,
});

/**
 * @param {string} font
 * @returns {boolean}
 */
function isSystemFontKeyword(font) {
	if (font.startsWith('-apple-')) {
		return true;
	}

	if (font === 'BlinkMacSystemFont') {
		return true;
	}

	return false;
}

/**
 * "To avoid mistakes in escaping, it is recommended to quote font family names
 * that contain white space, digits, or punctuation characters other than hyphens"
 * (https://www.w3.org/TR/CSS2/fonts.html#font-family-prop)
 *
 * @param {string} family
 * @returns {boolean}
 */
function quotesRecommended(family) {
	return !/^[-a-zA-Z]+$/.test(family);
}

/**
 * Quotes are required if the family is not a valid CSS identifier
 * (regexes from https://mathiasbynens.be/notes/unquoted-font-family)
 *
 * @param {string} family
 * @returns {boolean}
 */
function quotesRequired(family) {
	return family
		.split(/\s+/)
		.some((word) => /^(?:-?\d|--)/.test(word) || !/^[-\w\u{00A0}-\u{10FFFF}]+$/u.test(word));
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always-where-required', 'always-where-recommended', 'always-unless-keyword'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^font(-family)?$/i, (decl) => {
			const fontFamilies = findFontFamily(decl.value);

			if (fontFamilies.length === 0) {
				return;
			}

			for (const fontFamilyNode of fontFamilies) {
				let rawFamily = fontFamilyNode.value;

				if ('quote' in fontFamilyNode) {
					rawFamily = fontFamilyNode.quote + rawFamily + fontFamilyNode.quote;
				}

				checkFamilyName(rawFamily, decl);
			}
		});

		/**
		 * @param {string} rawFamily
		 * @param {import('postcss').Declaration} decl
		 */
		function checkFamilyName(rawFamily, decl) {
			if (!isStandardSyntaxValue(rawFamily)) {
				return;
			}

			if (isVariable(rawFamily)) {
				return;
			}

			const hasQuotes = rawFamily.startsWith("'") || rawFamily.startsWith('"');

			// Clean the family of its quotes
			const family = rawFamily.replace(/^['"]|['"]$/g, '');

			// Disallow quotes around (case-insensitive) keywords
			// and system font keywords in all cases
			if (keywordSets.fontFamilyKeywords.has(family.toLowerCase()) || isSystemFontKeyword(family)) {
				if (hasQuotes) {
					return complain(messages.rejected(family), family, decl);
				}

				return;
			}

			const required = quotesRequired(family);
			const recommended = quotesRecommended(family);

			switch (primary) {
				case 'always-unless-keyword':
					if (!hasQuotes) {
						return complain(messages.expected(family), family, decl);
					}

					return;

				case 'always-where-recommended':
					if (!recommended && hasQuotes) {
						return complain(messages.rejected(family), family, decl);
					}

					if (recommended && !hasQuotes) {
						return complain(messages.expected(family), family, decl);
					}

					return;

				case 'always-where-required':
					if (!required && hasQuotes) {
						return complain(messages.rejected(family), family, decl);
					}

					if (required && !hasQuotes) {
						return complain(messages.expected(family), family, decl);
					}
			}
		}

		/**
		 * @param {string} message
		 * @param {string} family
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(message, family, decl) {
			report({
				result,
				ruleName,
				message,
				node: decl,
				word: family,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
