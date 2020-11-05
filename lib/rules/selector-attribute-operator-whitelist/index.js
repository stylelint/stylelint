// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-attribute-operator-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (operator) => `Unexpected operator "${operator}"`,
});

function rule(listInput) {
	const list = [].concat(listInput);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [_.isString],
		});

		if (!validOptions) {
			return;
		}

		result.warn(
			`'${ruleName}' has been deprecated. Instead use 'selector-attribute-operator-allowed-list'.`,
			{
				stylelintType: 'deprecation',
				stylelintReference: `https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
			},
		);

		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		root.walkRules((rule) => {
			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			if (!rule.selector.includes('[') || !rule.selector.includes('=')) {
				return;
			}

			parseSelector(rule.selector, result, rule, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					const operator = attributeNode.operator;

					if (!operator || (operator && list.includes(operator))) {
						return;
					}

					report({
						message: messages.rejected(operator),
						node: rule,
						index: attributeNode.sourceIndex + attributeNode.offsetOf('operator'),
						result,
						ruleName,
					});
				});
			});
		});
	};
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { deprecated: true };

module.exports = rule;
