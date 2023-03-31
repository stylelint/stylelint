'use strict';

const arrayEqual = require('../../utils/arrayEqual');
const { basicKeywords } = require('../../reference/keywords');
const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { longhandSubPropertiesOfShorthandProperties } = require('../../reference/properties');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'declaration-block-no-redundant-longhand-properties';

const messages = ruleMessages(ruleName, {
	expected: (props) => `Expected shorthand property "${props}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties',
	fixable: true,
};

/** @typedef {import('postcss').Declaration} Declaration */

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
					ignoreShorthands: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {Map<string, import('stylelint').ShorthandProperties[]>} */
		const longhandToShorthands = new Map();

		for (const [shorthand, longhandProps] of longhandSubPropertiesOfShorthandProperties.entries()) {
			if (optionsMatches(secondaryOptions, 'ignoreShorthands', shorthand)) {
				continue;
			}

			for (const longhand of longhandProps) {
				const shorthands = longhandToShorthands.get(longhand) || [];

				shorthands.push(shorthand);
				longhandToShorthands.set(longhand, shorthands);
			}
		}

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Map<string, string[]>} */
			const longhandDeclarations = new Map();
			/** @type {Map<string, Declaration[]>} */
			const longhandDeclarationNodes = new Map();

			eachDecl((decl) => {
				// basic keywords are not allowed in shorthand properties
				if (basicKeywords.has(decl.value)) {
					return;
				}

				const prop = decl.prop.toLowerCase();
				const unprefixedProp = vendor.unprefixed(prop);
				const prefix = vendor.prefix(prop);

				const shorthandProperties = longhandToShorthands.get(unprefixedProp);

				if (!shorthandProperties) {
					return;
				}

				for (const shorthandProperty of shorthandProperties) {
					const prefixedShorthandProperty = prefix + shorthandProperty;
					const longhandDeclaration = longhandDeclarations.get(prefixedShorthandProperty) || [];
					const longhandDeclarationNode =
						longhandDeclarationNodes.get(prefixedShorthandProperty) || [];

					longhandDeclaration.push(prop);
					longhandDeclarations.set(prefixedShorthandProperty, longhandDeclaration);

					longhandDeclarationNode.push(decl);
					longhandDeclarationNodes.set(prefixedShorthandProperty, longhandDeclarationNode);

					const shorthandProps = longhandSubPropertiesOfShorthandProperties.get(shorthandProperty);
					const prefixedShorthandData = Array.from(shorthandProps || []).map(
						(item) => prefix + item,
					);

					const copiedPrefixedShorthandData = [...prefixedShorthandData];

					if (!arrayEqual(copiedPrefixedShorthandData.sort(), longhandDeclaration.sort())) {
						continue;
					}

					if (context.fix) {
						const declNodes = longhandDeclarationNodes.get(prefixedShorthandProperty) || [];
						const [firstDeclNode] = declNodes;

						if (firstDeclNode) {
							const transformedDeclarationNodes = new Map(
								declNodes.map((d) => [d.prop.toLowerCase(), d]),
							);
							const resolvedShorthandValue = prefixedShorthandData
								.map((p) => transformedDeclarationNodes.get(p)?.value.trim())
								.filter(Boolean)
								.join(' ');

							const newShorthandDeclarationNode = firstDeclNode.clone({
								prop: prefixedShorthandProperty,
								value: resolvedShorthandValue,
							});

							firstDeclNode.replaceWith(newShorthandDeclarationNode);

							declNodes.forEach((node) => node.remove());

							return;
						}
					}

					report({
						ruleName,
						result,
						node: decl,
						word: decl.prop,
						message: messages.expected,
						messageArgs: [prefixedShorthandProperty],
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
