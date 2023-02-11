'use strict';

const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');
const vendor = require('../../utils/vendor');

const ruleName = 'declaration-block-no-duplicate-properties';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected duplicate "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignore: [
						'consecutive-duplicates',
						'consecutive-duplicates-with-different-values',
						'consecutive-duplicates-with-same-prefixless-values',
					],
					ignoreProperties: [isString],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreDuplicates = optionsMatches(secondaryOptions, 'ignore', 'consecutive-duplicates');
		const ignoreDiffValues = optionsMatches(
			secondaryOptions,
			'ignore',
			'consecutive-duplicates-with-different-values',
		);
		const ignorePrefixlessSameValues = optionsMatches(
			secondaryOptions,
			'ignore',
			'consecutive-duplicates-with-same-prefixless-values',
		);

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {import('postcss').Declaration[]} */
			const decls = [];

			eachDecl((decl) => {
				const prop = decl.prop;
				const lowerProp = decl.prop.toLowerCase();
				const value = decl.value;
				const important = decl.important;

				if (!isStandardSyntaxProperty(prop)) {
					return;
				}

				if (isCustomProperty(prop)) {
					return;
				}

				// Return early if the property is to be ignored
				if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
					return;
				}

				// Ignore the src property as commonly duplicated in at-fontface
				if (lowerProp === 'src') {
					return;
				}

				const indexDuplicate = decls.findIndex((d) => d.prop.toLowerCase() === lowerProp);

				if (indexDuplicate === -1) {
					decls.push(decl);
				}

				const duplicateDecl = decls[indexDuplicate];

				if (!duplicateDecl) {
					return;
				}

				const duplicateValue = duplicateDecl.value || '';
				const duplicateImportant = duplicateDecl.important || false;
				const duplicateIsMoreImportant = !important && duplicateImportant;
				const duplicatesAreConsecutive = indexDuplicate === decls.length - 1;
				const unprefixedDuplicatesAreEqual =
					vendor.unprefixed(value) === vendor.unprefixed(duplicateValue);

				const fixOrReport = () => {
					if (!context.fix) {
						return report({
							message: messages.rejected,
							messageArgs: [prop],
							node: decl,
							result,
							ruleName,
							word: prop,
						});
					}

					if (duplicateIsMoreImportant) {
						return decl.remove();
					}

					return duplicateDecl.remove();
				};

				if (ignoreDiffValues || ignorePrefixlessSameValues) {
					if (
						!duplicatesAreConsecutive ||
						(ignorePrefixlessSameValues && !unprefixedDuplicatesAreEqual)
					) {
						fixOrReport();
					}

					if (value !== duplicateValue) {
						return;
					}

					if (context.fix) {
						return duplicateDecl.remove();
					}

					return report({
						message: messages.rejected,
						messageArgs: [prop],
						node: decl,
						result,
						ruleName,
						word: prop,
					});
				}

				if (ignoreDuplicates && duplicatesAreConsecutive) {
					return;
				}

				fixOrReport();
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
