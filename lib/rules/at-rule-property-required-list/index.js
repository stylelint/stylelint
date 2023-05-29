'use strict';

const createMapWithSet = require('../../utils/createMapWithSet');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'at-rule-property-required-list';

const messages = ruleMessages(ruleName, {
	expected: (atRule, property) => `Expected property "${property}" for at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-property-required-list',
};

/** @type {import('stylelint').Rule<Record<string, string | string[]>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString)],
		});

		if (!validOptions) {
			return;
		}

		const propLists = createMapWithSet(primary);

		/** @type {Set<string>} */
		const currentPropList = new Set();

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			const { name, nodes } = atRule;
			const atRuleName = name.toLowerCase();
			const propList = propLists.get(atRuleName);

			if (!propList) {
				return;
			}

			currentPropList.clear();

			for (const node of nodes) {
				if (!node || node.type !== 'decl') continue;

				const propName = node.prop.toLowerCase();

				if (!propList.has(propName)) continue;

				currentPropList.add(propName);
			}

			if (currentPropList.size === propList.size) {
				return;
			}

			for (const requiredProp of propList) {
				if (currentPropList.has(requiredProp)) continue;

				report({
					message: messages.expected,
					messageArgs: [atRuleName, requiredProp],
					node: atRule,
					word: `@${atRule.name}`,
					result,
					ruleName,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
