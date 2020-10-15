// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxCombinator = require('../../utils/isStandardSyntaxCombinator');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-combinator-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (combinator) => `Unexpected combinator "${combinator}"`,
});

function rule(list) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [_.isString],
		});

		if (!validOptions) {
			return;
		}

		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		root.walkRules((rule) => {
			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			const selector = rule.selector;

			parseSelector(selector, result, rule, (fullSelector) => {
				fullSelector.walkCombinators((combinatorNode) => {
					if (!isStandardSyntaxCombinator(combinatorNode)) {
						return;
					}

					const value = normalizeCombinator(combinatorNode.value);

					if (!list.includes(value)) {
						return;
					}

					report({
						result,
						ruleName,
						message: messages.rejected(value),
						node: rule,
						index: combinatorNode.sourceIndex,
					});
				});
			});
		});
	};
}

function normalizeCombinator(value) {
	return value.replace(/\s+/g, ' ');
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
