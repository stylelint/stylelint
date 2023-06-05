'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isBoolean, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-nested-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selector, pattern) => `Expected "${selector}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-nested-pattern',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isRegExp, isString],
			},
			{
				actual: secondaryOptions,
				possible: {
					splitList: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const normalizedPattern = isString(primary) ? new RegExp(primary) : primary;
		const splitList = secondaryOptions && secondaryOptions.splitList;

		root.walkRules((ruleNode) => {
			if (ruleNode.parent && ruleNode.parent.type !== 'rule') {
				return;
			}

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selectors = splitList ? ruleNode.selectors : [ruleNode.selector];

			for (const selector of selectors) {
				if (normalizedPattern.test(selector)) {
					continue;
				}

				report({
					result,
					ruleName,
					message: messages.expected,
					messageArgs: [selector, primary],
					node: ruleNode,
					word: selector,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
