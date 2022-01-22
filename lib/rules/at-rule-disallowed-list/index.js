'use strict';

const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'at-rule-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected at-rule "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/at-rule-disallowed-list',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	// To allow for just a string as a parameter (not only arrays of strings)
	const primaryValues = [primary].flat();

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primaryValues,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		/** @type {string[]} */
		const atRuleNames = primaryValues;

		root.walkAtRules((atRule) => {
			const name = atRule.name;

			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			if (!atRuleNames.includes(vendor.unprefixed(name).toLowerCase())) {
				return;
			}

			report({
				message: messages.rejected(name),
				node: atRule,
				result,
				ruleName,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
