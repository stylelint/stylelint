'use strict';

const getRuleSelector = require('../../utils/getRuleSelector');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { assertString } = require('../../utils/validateTypes');

const ruleName = 'selector-attribute-quotes';

const messages = ruleMessages(ruleName, {
	expected: (value) => `Expected quotes around "${value}"`,
	rejected: (value) => `Unexpected quotes around "${value}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-attribute-quotes',
};

const acceptedQuoteMark = '"';

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (!ruleNode.selector.includes('[') || !ruleNode.selector.includes('=')) {
				return;
			}

			parseSelector(getRuleSelector(ruleNode), result, ruleNode, (selectorTree) => {
				let selectorFixed = false;

				selectorTree.walkAttributes((attributeNode) => {
					if (!attributeNode.operator) {
						return;
					}

					if (!attributeNode.quoted && primary === 'always') {
						if (context.fix) {
							selectorFixed = true;
							attributeNode.quoteMark = acceptedQuoteMark;
						} else {
							assertString(attributeNode.value);
							complain(
								messages.expected(attributeNode.value),
								attributeNode.sourceIndex + attributeNode.offsetOf('value'),
							);
						}
					}

					if (attributeNode.quoted && primary === 'never') {
						if (context.fix) {
							selectorFixed = true;
							attributeNode.quoteMark = null;
						} else {
							assertString(attributeNode.value);
							complain(
								messages.rejected(attributeNode.value),
								attributeNode.sourceIndex + attributeNode.offsetOf('value'),
							);
						}
					}
				});

				if (selectorFixed) {
					ruleNode.selector = selectorTree.toString();
				}
			});

			/**
			 * @param {string} message
			 * @param {number} index
			 */
			function complain(message, index) {
				report({
					message,
					index,
					result,
					ruleName,
					node: ruleNode,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
