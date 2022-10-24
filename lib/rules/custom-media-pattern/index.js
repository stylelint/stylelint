'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'custom-media-pattern';

const messages = ruleMessages(ruleName, {
	expected: (mediaName, pattern) => `Expected "${mediaName}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-media-pattern',
};

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

			const [fullName, customMediaName] = atRule.params.match(/^--(\S+)\b/) || [];

			if (fullName === undefined || customMediaName === undefined) {
				throw new Error(`Unexpected at-rule params: "${atRule.params}"`);
			}

			if (regexpPattern.test(customMediaName)) {
				return;
			}

			const index = atRuleParamIndex(atRule);

			report({
				message: messages.expected,
				messageArgs: [fullName, primary],
				node: atRule,
				index,
				endIndex: index + fullName.length,
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
