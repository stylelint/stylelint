'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'custom-media-pattern';

const messages = ruleMessages(ruleName, {
	expected: (pattern) => `Expected custom media query name to match pattern "${pattern}"`,
});

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const regexpPattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkAtRules((atRule) => {
			if (atRule.name.toLowerCase() !== 'custom-media') {
				return;
			}

			const match = atRule.params.match(/^--(\S+)\b/);

			if (match == null) throw new Error(`Unexpected at-rule params: "${atRule.params}"`);

			const customMediaName = match[1];

			if (regexpPattern.test(customMediaName)) {
				return;
			}

			report({
				message: messages.expected(primary),
				node: atRule,
				index: atRuleParamIndex(atRule),
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
