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

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/keyframes-name-pattern',
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

		const regex = isString(primary) ? new RegExp(primary) : primary;

		root.walkAtRules(/keyframes/i, (keyframesNode) => {
			const value = keyframesNode.params;

			if (regex.test(value)) {
				return;
			}

			const index = atRuleParamIndex(keyframesNode);
			const endIndex = index + value.length;

			report({
				index,
				endIndex,
				message: messages.expected(value, primary),
				node: keyframesNode,
				ruleName,
				result,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
