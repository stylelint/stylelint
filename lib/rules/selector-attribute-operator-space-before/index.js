// @ts-nocheck

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

function rule(expectation, options, context) {
	const checker = whitespaceChecker('space', expectation, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
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
						const rawAttrAfter =
							attributeNode.raws.spaces &&
							attributeNode.raws.spaces.attribute &&
							attributeNode.raws.spaces.attribute.after;
						const { attrAfter, setAttrAfter } = rawAttrAfter
							? {
									attrAfter: rawAttrAfter,
									setAttrAfter(fixed) {
										attributeNode.raws.spaces.attribute.after = fixed;
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

						if (expectation === 'always') {
							setAttrAfter(attrAfter.replace(/\s*$/, ' '));

							return true;
						}

						if (expectation === 'never') {
							setAttrAfter(attrAfter.replace(/\s*$/, ''));

							return true;
						}
				  }
				: null,
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
