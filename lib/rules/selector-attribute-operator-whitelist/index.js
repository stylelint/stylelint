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

function rule(whitelistInput) {
	const whitelist = [].concat(whitelistInput);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: whitelist,
			possible: [_.isString],
		});

		if (!validOptions) {
			return;
		}

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

					if (!operator || (operator && whitelist.includes(operator))) {
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
module.exports = rule;
