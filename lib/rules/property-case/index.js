'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const optionsMatches = require('../../utils/optionsMatches');
const { isRegExp, isString } = require('../../utils/validateTypes');
const { isRule } = require('../../utils/typeGuards');

const ruleName = 'property-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/property-case',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['lower', 'upper'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;

			if (!isStandardSyntaxProperty(prop)) {
				return;
			}

			if (isCustomProperty(prop)) {
				return;
			}

			const { parent } = decl;

			if (!parent) throw new Error('A parent node must be present');

			if (isRule(parent)) {
				const { selector } = parent;

				if (selector && optionsMatches(secondaryOptions, 'ignoreSelectors', selector)) {
					return;
				}
			}

			const expectedProp = primary === 'lower' ? prop.toLowerCase() : prop.toUpperCase();

			if (prop === expectedProp) {
				return;
			}

			if (context.fix) {
				decl.prop = expectedProp;

				return;
			}

			report({
				message: messages.expected(prop, expectedProp),
				node: decl,
				ruleName,
				result,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
