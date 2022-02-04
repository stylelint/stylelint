'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const findFontFamily = require('../../utils/findFontFamily');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'font-family-no-duplicate-names';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected duplicate name ${name}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/font-family-no-duplicate-names',
};

/**
 * @param {import('postcss-value-parser').Node} node
 */
const isFamilyNameKeyword = (node) =>
	!('quote' in node) && keywordSets.fontFamilyKeywords.has(node.value.toLowerCase());

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
					ignoreFontFamilyNames: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^font(-family)?$/i, (decl) => {
			const keywords = new Set();
			const familyNames = new Set();

			const fontFamilies = findFontFamily(decl.value);

			if (fontFamilies.length === 0) {
				return;
			}

			for (const fontFamilyNode of fontFamilies) {
				const family = fontFamilyNode.value.trim();

				if (optionsMatches(secondaryOptions, 'ignoreFontFamilyNames', family)) {
					continue;
				}

				if (isFamilyNameKeyword(fontFamilyNode)) {
					if (keywords.has(family.toLowerCase())) {
						complain(
							messages.rejected(family),
							declarationValueIndex(decl) + fontFamilyNode.sourceIndex,
							decl,
						);

						continue;
					}

					keywords.add(family);

					continue;
				}

				if (familyNames.has(family)) {
					complain(
						messages.rejected(family),
						declarationValueIndex(decl) + fontFamilyNode.sourceIndex,
						decl,
					);

					continue;
				}

				familyNames.add(family);
			}
		});

		/**
		 * @param {string} message
		 * @param {number} index
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(message, index, decl) {
			report({
				result,
				ruleName,
				message,
				node: decl,
				index,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
