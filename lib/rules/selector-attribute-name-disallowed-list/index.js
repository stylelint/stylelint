// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-attribute-name-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected name "${name}"`,
});

function rule(listInput) {
	const list = [].concat(listInput);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
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
					const attributeName = attributeNode.qualifiedAttribute;

					if (!attributeName || (attributeName && !list.includes(attributeName))) {
						return;
					}

					report({
						message: messages.rejected(attributeName),
						node: rule,
						index: attributeNode.sourceIndex + attributeNode.offsetOf('attribute'),
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
