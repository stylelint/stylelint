'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-disallowed-list',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	const list = [primary].flat();

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			if (!matchesStringOrRegExp(selector, list)) {
				return;
			}

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: ruleNode,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
