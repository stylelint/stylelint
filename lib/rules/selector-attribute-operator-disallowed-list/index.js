'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'selector-attribute-operator-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (operator) => `Unexpected operator "${operator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-attribute-operator-disallowed-list',
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

		const primaryValues = new Set([primary].flat());

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const { selector } = ruleNode;

			if (!selector.includes('[') || !selector.includes('=')) {
				return;
			}

			parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					const { operator } = attributeNode;

					if (!operator || !primaryValues.has(operator)) {
						return;
					}

					const index = attributeNode.sourceIndex + attributeNode.offsetOf('operator');
					const endIndex = index + operator.length;

					report({
						message: messages.rejected(operator),
						node: ruleNode,
						index,
						endIndex,
						result,
						ruleName,
					});
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
