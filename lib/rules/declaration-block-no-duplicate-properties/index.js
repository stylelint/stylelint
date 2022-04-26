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
	url: 'https://stylelint.io/user-guide/rules/list/declaration-block-no-duplicate-properties',
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
			/** @type {string[]} */
			const decls = [];
			/** @type {string[]} */
			const values = [];

			eachDecl((decl) => {
				const prop = decl.prop;
				const value = decl.value;

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
				if (prop.toLowerCase() === 'src') {
					return;
				}

				const indexDuplicate = decls.indexOf(prop.toLowerCase());

				if (indexDuplicate !== -1) {
					if (ignoreDiffValues || ignorePrefixlessSameValues) {
						// fails if duplicates are not consecutive
						if (indexDuplicate !== decls.length - 1) {
							report({
								message: messages.rejected(prop),
								node: decl,
								result,
								ruleName,
								word: prop,
							});

							return;
						}

						const duplicateValue = values[indexDuplicate] || '';

						if (ignorePrefixlessSameValues) {
							// fails if values of consecutive, unprefixed duplicates are equal
							if (vendor.unprefixed(value) !== vendor.unprefixed(duplicateValue)) {
								report({
									message: messages.rejected(prop),
									node: decl,
									result,
									ruleName,
									word: prop,
								});

								return;
							}
						}

						// fails if values of consecutive duplicates are equal
						if (value === duplicateValue) {
							report({
								message: messages.rejected(prop),
								node: decl,
								result,
								ruleName,
								word: prop,
							});

							return;
						}

						return;
					}

					if (ignoreDuplicates && indexDuplicate === decls.length - 1) {
						return;
					}

					report({
						message: messages.rejected(prop),
						node: decl,
						result,
						ruleName,
						word: prop,
					});
				}

				decls.push(prop.toLowerCase());
				values.push(value.toLowerCase());
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
