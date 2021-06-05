// @ts-nocheck

'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const properties = require('known-css-properties').all;
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isBoolean, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'property-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected unknown property "${property}"`,
});

function rule(actual, options) {
	const allValidProperties = new Set(properties);

	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual },
			{
				actual: options,
				possible: {
					ignoreProperties: [isString, isRegExp],
					checkPrefixed: isBoolean,
					ignoreSelectors: [isString, isRegExp],
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const shouldCheckPrefixed = options && options.checkPrefixed;

		root.walkDecls(checkStatement);

		function checkStatement(decl) {
			const prop = decl.prop;

			if (!isStandardSyntaxProperty(prop)) {
				return;
			}

			if (!isStandardSyntaxDeclaration(decl)) {
				return;
			}

			if (isCustomProperty(prop)) {
				return;
			}

			if (!shouldCheckPrefixed && vendor.prefix(prop)) {
				return;
			}

			if (optionsMatches(options, 'ignoreProperties', prop)) {
				return;
			}

			const { selector } = decl.parent;

			if (selector && optionsMatches(options, 'ignoreSelectors', selector)) {
				return;
			}

			let node = decl.parent;

			while (node && node.type !== 'root') {
				const { type, name } = node;

				if (type === 'atrule' && optionsMatches(options, 'ignoreAtRules', name)) {
					return;
				}

				node = node.parent;
			}

			if (allValidProperties.has(prop.toLowerCase())) {
				return;
			}

			report({
				message: messages.rejected(prop),
				node: decl,
				result,
				ruleName,
			});
		}
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
