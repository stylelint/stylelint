'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const properties = require('known-css-properties').all;
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isAtRule, isRule } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isBoolean, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'property-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected unknown property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/property-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	const allValidProperties = new Set(properties);

	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
					checkPrefixed: [isBoolean],
					ignoreSelectors: [isString, isRegExp],
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const shouldCheckPrefixed = secondaryOptions && secondaryOptions.checkPrefixed;

		root.walkDecls(checkStatement);

		/**
		 * @param {import('postcss').Declaration} decl
		 */
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

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) {
				return;
			}

			const parent = decl.parent;

			if (
				parent &&
				isRule(parent) &&
				optionsMatches(secondaryOptions, 'ignoreSelectors', parent.selector)
			) {
				return;
			}

			/** @type {import('postcss').Node | undefined} */
			let node = parent;

			while (node && node.type !== 'root') {
				if (isAtRule(node) && optionsMatches(secondaryOptions, 'ignoreAtRules', node.name)) {
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
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
