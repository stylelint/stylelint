// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const regexes = require('../../utils/regexes.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'container-name-pattern';

const messages = ruleMessages(ruleName, {
	expected: (containerName, pattern) => `Expected "${containerName}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/container-name-pattern',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isRegExp, validateTypes.isString],
		});

		if (!validOptions) {
			return;
		}

		const regex = validateTypes.isString(primary) ? new RegExp(primary) : primary;

		root.walkAtRules(regexes.atRuleRegexes.containerName, (containerNode) => {
			if (!isStandardSyntaxAtRule(containerNode)) {
				return;
			}

			const value = containerNode.params;

			if (regex.test(value)) {
				return;
			}

			const index = nodeFieldIndices.atRuleParamIndex(containerNode);
			const endIndex = index + value.length;

			report({
				index,
				endIndex,
				message: messages.expected,
				messageArgs: [value, primary],
				node: containerNode,
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
