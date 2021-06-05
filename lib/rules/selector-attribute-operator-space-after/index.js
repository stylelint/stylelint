// @ts-nocheck

'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorAttributeOperatorSpaceChecker = require('../selectorAttributeOperatorSpaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-attribute-operator-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: (operator) => `Expected single space after "${operator}"`,
	rejectedAfter: (operator) => `Unexpected whitespace after "${operator}"`,
});

function rule(expectation, options, context) {
	return (root, result) => {
		const checker = whitespaceChecker('space', expectation, messages);
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
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			checkBeforeOperator: false,
			fix: context.fix
				? (attributeNode) => {
						const { operatorAfter, setOperatorAfter } = (() => {
							const rawOperator = attributeNode.raws.operator;

							if (rawOperator) {
								return {
									operatorAfter: rawOperator.slice(attributeNode.operator.length),
									setOperatorAfter(fixed) {
										delete attributeNode.raws.operator;

										if (!attributeNode.raws.spaces) attributeNode.raws.spaces = {};

										if (!attributeNode.raws.spaces.operator)
											attributeNode.raws.spaces.operator = {};

										attributeNode.raws.spaces.operator.after = fixed;
									},
								};
							}

							const rawOperatorAfter =
								attributeNode.raws.spaces &&
								attributeNode.raws.spaces.operator &&
								attributeNode.raws.spaces.operator.after;

							if (rawOperatorAfter) {
								return {
									operatorAfter: rawOperatorAfter,
									setOperatorAfter(fixed) {
										attributeNode.raws.spaces.operator.after = fixed;
									},
								};
							}

							return {
								operatorAfter:
									(attributeNode.spaces.operator && attributeNode.spaces.operator.after) || '',
								setOperatorAfter(fixed) {
									if (!attributeNode.spaces.operator) attributeNode.spaces.operator = {};

									attributeNode.spaces.operator.after = fixed;
								},
							};
						})();

						if (expectation === 'always') {
							setOperatorAfter(operatorAfter.replace(/^\s*/, ' '));

							return true;
						}

						if (expectation === 'never') {
							setOperatorAfter(operatorAfter.replace(/^\s*/, ''));

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
