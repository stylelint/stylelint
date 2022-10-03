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
	url: 'https://stylelint.io/user-guide/rules/at-rule-disallowed-list',
};

/** @type {import('stylelint').Rule<string | string[]>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		const primaryValues = [primary].flat();

		root.walkAtRules((atRule) => {
			const name = atRule.name;

			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			if (!primaryValues.includes(vendor.unprefixed(name).toLowerCase())) {
				return;
			}

			report({
				message: messages.rejected(name),
				node: atRule,
				result,
				ruleName,
				word: `@${atRule.name}`,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
