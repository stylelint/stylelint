'use strict';

const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isPlainObject } = require('is-plain-object');

const ruleName = 'at-rule-property-required-list';

const messages = ruleMessages(ruleName, {
	expected: (property, atRule) => `Expected property "${property}" for at-rule "${atRule}"`,
});

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isPlainObject],
		});

		if (!validOptions) {
			return;
		}

		/** @type {Record<string, string[]>} */
		const list = primary;

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
					(node) => node.type === 'decl' && node.prop.toLowerCase() === propertyName,
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
};

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
