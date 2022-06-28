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

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-attribute-operator-space-after',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const checker = whitespaceChecker('space', primary, messages);
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
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			checkBeforeOperator: false,
			fix: context.fix
				? (attributeNode) => {
						/** @type {{ operatorAfter: string, setOperatorAfter: (fixed: string) => void }} */
						const { operatorAfter, setOperatorAfter } = (() => {
							const rawOperator = attributeNode.raws.operator;

							if (rawOperator) {
								return {
									operatorAfter: rawOperator.slice(
										attributeNode.operator ? attributeNode.operator.length : 0,
									),
									setOperatorAfter(fixed) {
										delete attributeNode.raws.operator;

										if (!attributeNode.raws.spaces) attributeNode.raws.spaces = {};

										if (!attributeNode.raws.spaces.operator)
											attributeNode.raws.spaces.operator = {};

										attributeNode.raws.spaces.operator.after = fixed;
									},
								};
							}

							const rawSpacesOperator =
								attributeNode.raws.spaces && attributeNode.raws.spaces.operator;
							const rawOperatorAfter = rawSpacesOperator && rawSpacesOperator.after;

							if (rawOperatorAfter) {
								return {
									operatorAfter: rawOperatorAfter,
									setOperatorAfter(fixed) {
										rawSpacesOperator.after = fixed;
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

						if (primary === 'always') {
							setOperatorAfter(operatorAfter.replace(/^\s*/, ' '));

							return true;
						}

						if (primary === 'never') {
							setOperatorAfter(operatorAfter.replace(/^\s*/, ''));

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
