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

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	const list = [primary].flat();

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [isString],
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
					const operator = attributeNode.operator;

					if (!operator || (operator && !list.includes(operator))) {
						return;
					}

					report({
						message: messages.rejected(operator),
						node: ruleNode,
						index: attributeNode.sourceIndex + attributeNode.offsetOf('operator'),
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
