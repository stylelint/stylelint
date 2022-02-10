'use strict';

const isStandardSyntaxCombinator = require('../../utils/isStandardSyntaxCombinator');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'selector-combinator-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (combinator) => `Unexpected combinator "${combinator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-combinator-disallowed-list',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			parseSelector(selector, result, ruleNode, (fullSelector) => {
				fullSelector.walkCombinators((combinatorNode) => {
					if (!isStandardSyntaxCombinator(combinatorNode)) {
						return;
					}

					const value = normalizeCombinator(combinatorNode.value);

					if (!primary.includes(value)) {
						return;
					}

					report({
						result,
						ruleName,
						message: messages.rejected(value),
						node: ruleNode,
						index: combinatorNode.sourceIndex,
					});
				});
			});
		});
	};
};

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeCombinator(value) {
	return value.replace(/\s+/g, ' ');
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
