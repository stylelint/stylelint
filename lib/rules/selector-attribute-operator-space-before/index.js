'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorAttributeOperatorSpaceChecker = require('../selectorAttributeOperatorSpaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-attribute-operator-space-before';

const messages = ruleMessages(ruleName, {
	expectedBefore: (operator) => `Expected single space before "${operator}"`,
	rejectedBefore: (operator) => `Unexpected whitespace before "${operator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-attribute-operator-space-before',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		selectorAttributeOperatorSpaceChecker({
			root,
			result,
			locationChecker: checker.before,
			checkedRuleName: ruleName,
			checkBeforeOperator: true,
			fix: context.fix
				? (attributeNode) => {
						const rawAttr = attributeNode.raws.spaces && attributeNode.raws.spaces.attribute;
						const rawAttrAfter = rawAttr && rawAttr.after;

						/** @type {{ attrAfter: string, setAttrAfter: (fixed: string) => void }} */
						const { attrAfter, setAttrAfter } = rawAttrAfter
							? {
									attrAfter: rawAttrAfter,
									setAttrAfter(fixed) {
										rawAttr.after = fixed;
									},
							  }
							: {
									attrAfter:
										(attributeNode.spaces.attribute && attributeNode.spaces.attribute.after) || '',
									setAttrAfter(fixed) {
										if (!attributeNode.spaces.attribute) attributeNode.spaces.attribute = {};

										attributeNode.spaces.attribute.after = fixed;
									},
							  };

						if (primary === 'always') {
							setAttrAfter(attrAfter.replace(/\s*$/, ' '));

							return true;
						}

						if (primary === 'never') {
							setAttrAfter(attrAfter.replace(/\s*$/, ''));

							return true;
						}

						return false;
				  }
				: null,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
