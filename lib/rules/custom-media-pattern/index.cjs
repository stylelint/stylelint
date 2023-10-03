'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

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
			possible: [validateTypes.isRegExp, validateTypes.isString],
		});

		if (!validOptions) {
			return;
		}

		const regexpPattern = validateTypes.isString(primary) ? new RegExp(primary) : primary;

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