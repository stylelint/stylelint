// @ts-nocheck

'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const optionsMatches = require('../../utils/optionsMatches');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'property-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

function rule(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: expectation,
				possible: ['lower', 'upper'],
			},
			{
				actual: options,
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

			const { selector } = decl.parent;

			if (selector && optionsMatches(options, 'ignoreSelectors', selector)) {
				return;
			}

			const expectedProp = expectation === 'lower' ? prop.toLowerCase() : prop.toUpperCase();

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
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
