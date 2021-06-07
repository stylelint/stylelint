// @ts-nocheck

'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'keyframes-name-pattern';

const messages = ruleMessages(ruleName, {
	expected: (keyframeName, pattern) =>
		`Expected keyframe name "${keyframeName}" to match pattern "${pattern}"`,
});

function rule(pattern) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: pattern,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const regex = isString(pattern) ? new RegExp(pattern) : pattern;

		root.walkAtRules(/keyframes/i, (keyframesNode) => {
			const value = keyframesNode.params;

			if (regex.test(value)) {
				return;
			}

			report({
				index: atRuleParamIndex(keyframesNode),
				message: messages.expected(value, pattern),
				node: keyframesNode,
				ruleName,
				result,
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
