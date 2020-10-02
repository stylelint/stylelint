// @ts-nocheck

'use strict';

const _ = require('lodash');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-pattern';

const messages = ruleMessages(ruleName, {
	expected: 'Expected comment to match specified pattern',
});

function rule(pattern) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: pattern,
			possible: [_.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			const text = comment.text;


			if (pattern.test(text)) {
				return;
			}

			report({
				message: messages.expected,
				node: comment,
				result,
				ruleName,
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
