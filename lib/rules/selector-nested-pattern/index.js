'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-nested-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selector, pattern) =>
		`Expected nested selector "${selector}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-nested-pattern',
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

		const normalizedPattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkRules((ruleNode) => {
			if (ruleNode.parent && ruleNode.parent.type !== 'rule') {
				return;
			}

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			if (normalizedPattern.test(selector)) {
				return;
			}

			report({
				result,
				ruleName,
				message: messages.expected(selector, primary),
				node: ruleNode,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
