'use strict';

const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const { atKeywords } = require('../../reference/atKeywords');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'at-rule-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (atRule) => `Unexpected unknown at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-no-unknown',
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
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			const name = atRule.name;

			// Return early if at-rule is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreAtRules', atRule.name)) {
				return;
			}

			if (vendor.prefix(name) || atKeywords.has(name.toLowerCase())) {
				return;
			}

			const atName = `@${name}`;

			report({
				message: messages.rejected,
				messageArgs: [atName],
				node: atRule,
				ruleName,
				result,
				word: atName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
