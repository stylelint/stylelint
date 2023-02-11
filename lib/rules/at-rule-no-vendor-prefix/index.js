'use strict';

const isAutoprefixable = require('../../utils/isAutoprefixable');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'at-rule-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (p) => `Unexpected vendor-prefixed at-rule "@${p}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			const name = atRule.name;

			if (!name.startsWith('-')) {
				return;
			}

			if (!isAutoprefixable.atRuleName(name)) {
				return;
			}

			if (context.fix) {
				atRule.name = isAutoprefixable.unprefix(atRule.name);

				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [name],
				node: atRule,
				word: `@${name}`,
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
