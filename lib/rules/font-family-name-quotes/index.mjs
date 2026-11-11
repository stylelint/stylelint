import { fontFamilyKeywords, prefixedSystemFonts } from '../../reference/keywords.mjs';
import findFontFamily from '../../utils/findFontFamily.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import isVariable from '../../utils/isVariable.mjs';
import { propertyRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'font-family-name-quotes';

const messages = ruleMessages(ruleName, {
	expected: (family) => `Expected quotes around "${family}"`,
	rejected: (family) => `Expected no quotes around "${family}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/font-family-name-quotes',
	fixable: true,
};

/**
 * @param {string} font
 * @returns {boolean}
 */
function isSystemFontKeyword(font) {
	if (prefixedSystemFonts.has(font)) {
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
	return !/^[-a-z]+$/i.test(family);
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
 *   hasFix: boolean,
 *   sourceIndex: number,
 *   resetIndexes: (offset: number) => void,
 *   removeQuotes: () => void,
 *   addQuotes: () => void,
 * }} MutableNode
 */

/**
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
		const rawName = quote ? `${quote}${name}${quote}` : name;
		const { sourceIndex, sourceEndIndex } = fontFamily;

		/** @type {MutableNode} */
		const newNode = {
			name,
			rawName,
			sourceIndex,
			hasQuotes: Boolean(quote),
			// A fix is only safe where the source text is exactly the raw name, e.g. not a name with a comment inside
			hasFix: getDeclarationValue(decl).slice(sourceIndex, sourceEndIndex) === rawName,
			resetIndexes(offset) {
				mutableNodes.slice(idx + 1).forEach((n) => (n.sourceIndex += offset));
			},
			removeQuotes() {
				if (this.hasQuotes === false) return;

				const openIndex = this.sourceIndex;
				const closeIndex = openIndex + this.name.length + 2;
				const value = getDeclarationValue(decl);

				this.hasQuotes = false;
				setDeclarationValue(
					decl,
					value.slice(0, openIndex) + this.name + value.substring(closeIndex),
				);
				this.resetIndexes(-2);
			},
			addQuotes() {
				if (this.hasQuotes === true) return;

				const openIndex = this.sourceIndex;
				const closeIndex = openIndex + this.name.length;
				const value = getDeclarationValue(decl);

				this.hasQuotes = true;
				const fixedName = `"${this.name}"`;

				setDeclarationValue(
					decl,
					value.slice(0, openIndex) + fixedName + value.substring(closeIndex),
				);
				this.resetIndexes(2);
			},
		};

		mutableNodes.push(newNode);
	});

	return mutableNodes;
};

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always-where-required', 'always-where-recommended', 'always-unless-keyword'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls(propertyRegexes.fontFamilyAndShorthandName, (decl) => {
			const value = getDeclarationValue(decl);

			if (!isStandardSyntaxValue(value)) {
				return;
			}

			const fontFamilyNodes = makeMutableFontFamilies(findFontFamily(value), decl);

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

			if (isVariable(rawFamily)) {
				return;
			}

			// Disallow quotes around (case-insensitive) keywords
			// and system font keywords in all cases
			if (fontFamilyKeywords.has(family.toLowerCase()) || isSystemFontKeyword(family)) {
				if (hasQuotes) {
					return complain('rejected', fontFamilyNode, decl);
				}

				return;
			}

			const required = quotesRequired(family);
			const recommended = quotesRecommended(family);

			switch (primary) {
				case 'always-unless-keyword':
					if (!hasQuotes) {
						return complain('expected', fontFamilyNode, decl);
					}

					return;

				case 'always-where-recommended':
					if (!recommended && hasQuotes) {
						return complain('rejected', fontFamilyNode, decl);
					}

					if (recommended && !hasQuotes) {
						return complain('expected', fontFamilyNode, decl);
					}

					return;

				case 'always-where-required':
					if (!required && hasQuotes) {
						return complain('rejected', fontFamilyNode, decl);
					}

					if (required && !hasQuotes) {
						return complain('expected', fontFamilyNode, decl);
					}
			}
		}

		/**
		 * @param {keyof typeof messages} messageType
		 * @param {MutableNode} fontFamilyNode
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(messageType, fontFamilyNode, decl) {
			const { name, rawName, hasFix } = fontFamilyNode;
			const fix = hasFix
				? () => {
						return messageType === 'expected'
							? fontFamilyNode.addQuotes()
							: fontFamilyNode.removeQuotes();
					}
				: undefined;

			report({
				result,
				ruleName,
				message: messages[messageType],
				messageArgs: [name],
				node: decl,
				word: rawName,
				fix: {
					apply: fix,
					node: decl,
				},
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
