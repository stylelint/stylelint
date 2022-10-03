'use strict';

const isStandardSyntaxCombinator = require('../../utils/isStandardSyntaxCombinator');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'selector-combinator-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (combinator) => `Unexpected combinator "${combinator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-combinator-allowed-list',
};

/** @type {import('stylelint').Rule<string | string[]>} */
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

					const { value } = combinatorNode;
					const normalizedValue = normalizeCombinator(value);

					if (primary.includes(normalizedValue)) {
						return;
					}

					const { sourceIndex: index, raws } = combinatorNode;
					const endIndex = index + ((raws && raws.value) || value).length;

					report({
						result,
						ruleName,
						message: messages.rejected(normalizedValue),
						node: ruleNode,
						index,
						endIndex,
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
