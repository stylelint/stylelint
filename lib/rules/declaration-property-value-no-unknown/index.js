'use strict';

const { isPlainObject } = require('is-plain-object');
const { fork, parse } = require('css-tree');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'declaration-property-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected unknown value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown',
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
					ignoreProperties: [isString, isRegExp],
					ignoreValues: [isString, isRegExp],
					propertiesSyntax: [isPlainObject],
					typesSyntax: [isPlainObject],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const propertiesSyntax = (secondaryOptions && secondaryOptions.propertiesSyntax) || {};
		const typesSyntax = (secondaryOptions && secondaryOptions.typesSyntax) || {};

		const forkedLexer = fork({
			properties: propertiesSyntax,
			types: typesSyntax,
		}).lexer;

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			if (!isStandardSyntaxValue(value)) return;

			if (isCustomProperty(prop)) return;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) return;

			try {
				parse(decl.value, {
					context: 'value',
				});
			} catch (e) {
				return;
			}

			const { error } = forkedLexer.matchProperty(prop, value);

			if (!error) return;

			const { mismatchLength, mismatchOffset, name, rawMessage } = error;

			if (name !== 'SyntaxMatchError') return;

			if (rawMessage !== 'Mismatch') return;

			const mismatchValue = value.slice(mismatchOffset, mismatchOffset + mismatchLength);

			if (optionsMatches(secondaryOptions, 'ignoreValues', mismatchValue)) return;

			const index = declarationValueIndex(decl) + mismatchOffset;
			const endIndex = index + mismatchLength;

			report({
				message: messages.rejected(prop, mismatchValue),
				node: decl,
				index,
				endIndex,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
