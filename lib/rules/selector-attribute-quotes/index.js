// @ts-nocheck

'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-attribute-quotes';

const messages = ruleMessages(ruleName, {
	expected: (value) => `Expected quotes around "${value}"`,
	rejected: (value) => `Unexpected quotes around "${value}"`,
});

function rule(expectation) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (!ruleNode.selector.includes('[') || !ruleNode.selector.includes('=')) {
				return;
			}

			parseSelector(ruleNode.selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					if (!attributeNode.operator) {
						return;
					}

					if (!attributeNode.quoted && expectation === 'always') {
						complain(
							messages.expected(attributeNode.value),
							attributeNode.sourceIndex + attributeNode.offsetOf('value'),
						);
					}

					if (attributeNode.quoted && expectation === 'never') {
						complain(
							messages.rejected(attributeNode.value),
							attributeNode.sourceIndex + attributeNode.offsetOf('value'),
						);
					}
				});
			});

			function complain(message, index) {
				report({
					message,
					index,
					result,
					ruleName,
					node: ruleNode,
				});
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
