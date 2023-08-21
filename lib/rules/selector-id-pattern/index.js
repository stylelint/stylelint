'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const { isRegExp, isString } = require('../../utils/validateTypes.cjs');

const ruleName = 'selector-id-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selector, pattern) => `Expected "${selector}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-id-pattern',
};

/** @type {import('stylelint').Rule<string | RegExp>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const normalizedPattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkRules(/#/, (ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			parseSelector(ruleNode.selector, result, ruleNode, (fullSelector) => {
				fullSelector.walkIds((selectorNode) => {
					if (normalizedPattern.test(selectorNode.value)) {
						return;
					}

					const selector = String(selectorNode);

					report({
						result,
						ruleName,
						message: messages.expected,
						messageArgs: [selector, primary],
						node: ruleNode,
						word: selector,
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
