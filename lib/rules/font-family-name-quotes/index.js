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

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/font-family-name-quotes',
};

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

/**
 * @typedef {{
 *   name: string,
 *   rawName: string,
 *   hasQuotes: boolean,
 *   sourceIndex: number,
 *   resetIndexes: (offset: number) => void,
 *   removeQuotes: () => void,
 *   addQuotes: () => void,
 * }} MutableNode
 */

/**
 *
 * @param {import('postcss-value-parser').Node[]} fontFamilies
 * @param {import('postcss').Declaration} decl
 * @returns {MutableNode[]}
 */
const makeMutableFontFamilies = (fontFamilies, decl) => {
	/**
	 * @type {MutableNode[]}
	 */
	const mutableNodes = [];

	fontFamilies.forEach((fontFamily, idx) => {
		const quote = 'quote' in fontFamily && fontFamily.quote;
		const name = fontFamily.value;

		/** @type {MutableNode} */
		const newNode = {
			name,
			rawName: quote ? `${quote}${name}${quote}` : name,
			sourceIndex: fontFamily.sourceIndex,
			hasQuotes: Boolean(quote),
			resetIndexes(offset) {
				mutableNodes.slice(idx + 1).forEach((n) => (n.sourceIndex += offset));
			},
			removeQuotes() {
				if (this.hasQuotes === false) return;

				const openIndex = this.sourceIndex;
				const closeIndex = openIndex + this.name.length + 2;

				this.hasQuotes = false;
				decl.value = decl.value.slice(0, openIndex) + this.name + decl.value.substring(closeIndex);
				this.resetIndexes(-2);
			},
			addQuotes() {
				if (this.hasQuotes === true) return;

				const openIndex = this.sourceIndex;
				const closeIndex = openIndex + this.name.length;

				this.hasQuotes = true;
				const fixedName = `"${this.name}"`;

				decl.value = decl.value.slice(0, openIndex) + fixedName + decl.value.substring(closeIndex);
				this.resetIndexes(2);
			},
		};

		mutableNodes.push(newNode);
	});

	return mutableNodes;
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always-where-required', 'always-where-recommended', 'always-unless-keyword'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^font(-family)?$/i, (decl) => {
			let fontFamilyNodes = makeMutableFontFamilies(findFontFamily(decl.value), decl);

			if (fontFamilyNodes.length === 0) {
				return;
			}

			for (const fontFamilyNode of fontFamilyNodes) {
				checkFamilyName(fontFamilyNode, decl);
			}
		});

		/**
		 * @param {MutableNode} fontFamilyNode
		 * @param {import('postcss').Declaration} decl
		 */
		function checkFamilyName(fontFamilyNode, decl) {
			const { name: family, rawName: rawFamily, hasQuotes } = fontFamilyNode;

			if (!isStandardSyntaxValue(rawFamily)) {
				return;
			}

			if (isVariable(rawFamily)) {
				return;
			}

			// Disallow quotes around (case-insensitive) keywords
			// and system font keywords in all cases
			if (keywordSets.fontFamilyKeywords.has(family.toLowerCase()) || isSystemFontKeyword(family)) {
				if (hasQuotes) {
					if (context.fix) {
						fontFamilyNode.removeQuotes();

						return;
					}

					return complain(messages.rejected(family), rawFamily, decl);
				}

				return;
			}

			const required = quotesRequired(family);
			const recommended = quotesRecommended(family);

			switch (primary) {
				case 'always-unless-keyword':
					if (!hasQuotes) {
						if (context.fix) {
							fontFamilyNode.addQuotes();

							return;
						}

						return complain(messages.expected(family), rawFamily, decl);
					}

					return;

				case 'always-where-recommended':
					if (!recommended && hasQuotes) {
						if (context.fix) {
							fontFamilyNode.removeQuotes();

							return;
						}

						return complain(messages.rejected(family), rawFamily, decl);
					}

					if (recommended && !hasQuotes) {
						if (context.fix) {
							fontFamilyNode.addQuotes();

							return;
						}

						return complain(messages.expected(family), rawFamily, decl);
					}

					return;

				case 'always-where-required':
					if (!required && hasQuotes) {
						if (context.fix) {
							fontFamilyNode.removeQuotes();

							return;
						}

						return complain(messages.rejected(family), rawFamily, decl);
					}

					if (required && !hasQuotes) {
						if (context.fix) {
							fontFamilyNode.addQuotes();

							return;
						}

						return complain(messages.expected(family), rawFamily, decl);
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
rule.meta = meta;
module.exports = rule;
