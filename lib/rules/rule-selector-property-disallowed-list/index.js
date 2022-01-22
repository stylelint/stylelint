'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isPlainObject } = require('is-plain-object');

const ruleName = 'rule-selector-property-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, selector) => `Unexpected property "${property}" for selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/rule-selector-property-disallowed-list',
};

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

		const selectors = Object.keys(primary);

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selectorKey = selectors.find((selector) =>
				matchesStringOrRegExp(ruleNode.selector, selector),
			);

			if (!selectorKey) {
				return;
			}

			const disallowedProperties = primary[selectorKey];

			for (const node of ruleNode.nodes) {
				const isDisallowedProperty =
					node.type === 'decl' && matchesStringOrRegExp(node.prop, disallowedProperties);

				if (isDisallowedProperty) {
					report({
						message: messages.rejected(node.prop, ruleNode.selector),
						node,
						result,
						ruleName,
					});
				}
			}
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
