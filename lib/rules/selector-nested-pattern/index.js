// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-nested-pattern';

const messages = ruleMessages(ruleName, {
	expected: (selector, pattern) =>
		`Expected nested selector "${selector}" to match pattern "${pattern}"`,
});

function rule(pattern) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: pattern,
			possible: [_.isRegExp, _.isString],
		});

		if (!validOptions) {
			return;
		}

		const normalizedPattern = _.isString(pattern) ? new RegExp(pattern) : pattern;

		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		root.walkRules((rule) => {
			if (rule.parent.type !== 'rule') {
				return;
			}

			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			const selector = rule.selector;

			if (normalizedPattern.test(selector)) {
				return;
			}

			report({
				result,
				ruleName,
				message: messages.expected(selector, pattern),
				node: rule,
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
