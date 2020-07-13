// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'at-rule-property-required-list';

const messages = ruleMessages(ruleName, {
	expected: (property, atRule) => `Expected property "${property}" for at-rule "${atRule}"`,
});

function rule(list) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [_.isObject],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			const { name, nodes } = atRule;
			const atRuleName = name.toLowerCase();

			if (!list[atRuleName]) {
				return;
			}

			list[atRuleName].forEach((property) => {
				const propertyName = property.toLowerCase();

				const hasProperty = nodes.find(
					({ type, prop }) => type === 'decl' && prop.toLowerCase() === propertyName,
				);

				if (hasProperty) {
					return;
				}

				return report({
					message: messages.expected(propertyName, atRuleName),
					node: atRule,
					result,
					ruleName,
				});
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
