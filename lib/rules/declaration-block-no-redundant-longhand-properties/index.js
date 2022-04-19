'use strict';

const arrayEqual = require('../../utils/arrayEqual');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const shorthandData = require('../../reference/shorthandData');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'declaration-block-no-redundant-longhand-properties';

const messages = ruleMessages(ruleName, {
	expected: (props) => `Expected shorthand property "${props}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-block-no-redundant-longhand-properties',
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
					ignoreShorthands: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const longhandProperties = Object.entries(shorthandData).reduce(
			(/** @type {Record<string, string[]>} */ longhandProps, [key, values]) => {
				if (optionsMatches(secondaryOptions, 'ignoreShorthands', key)) {
					return longhandProps;
				}

				for (const value of values) {
					(longhandProps[value] || (longhandProps[value] = [])).push(key);
				}

				return longhandProps;
			},
			{},
		);

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Record<string, string[]>} */
			const longhandDeclarations = {};

			eachDecl((decl) => {
				const prop = decl.prop.toLowerCase();
				const unprefixedProp = vendor.unprefixed(prop);
				const prefix = vendor.prefix(prop);

				const shorthandProperties = longhandProperties[unprefixedProp];

				if (!shorthandProperties) {
					return;
				}

				for (const shorthandProperty of shorthandProperties) {
					const prefixedShorthandProperty = prefix + shorthandProperty;
					let longhandDeclaration = longhandDeclarations[prefixedShorthandProperty];

					if (!longhandDeclaration) {
						longhandDeclaration = longhandDeclarations[prefixedShorthandProperty] = [];
					}

					longhandDeclaration.push(prop);

					const prefixedShorthandData = (shorthandData[shorthandProperty] || []).map(
						(item) => prefix + item,
					);

					if (!arrayEqual(prefixedShorthandData.sort(), longhandDeclaration.sort())) {
						continue;
					}

					report({
						ruleName,
						result,
						node: decl,
						message: messages.expected(prefixedShorthandProperty),
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
