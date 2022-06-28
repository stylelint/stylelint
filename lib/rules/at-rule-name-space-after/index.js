'use strict';

const atRuleNameSpaceChecker = require('../atRuleNameSpaceChecker');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'at-rule-name-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: (name) => `Expected single space after at-rule name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/at-rule-name-space-after',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondary, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'always-single-line'],
		});

		if (!validOptions) {
			return;
		}

		atRuleNameSpaceChecker({
			root,
			result,
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			fix: context.fix
				? (atRule) => {
						if (typeof atRule.raws.afterName === 'string') {
							atRule.raws.afterName = atRule.raws.afterName.replace(/^\s*/, ' ');
						}
				  }
				: null,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
