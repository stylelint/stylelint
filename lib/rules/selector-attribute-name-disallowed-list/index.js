'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-attribute-name-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-attribute-name-disallowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (!ruleNode.selector.includes('[')) {
				return;
			}

			parseSelector(ruleNode.selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					const attributeName = attributeNode.qualifiedAttribute;

					if (!matchesStringOrRegExp(attributeName, primary)) {
						return;
					}

					const index = attributeNode.sourceIndex + attributeNode.offsetOf('attribute');
					const endIndex = index + attributeName.length;

					report({
						message: messages.rejected(attributeName),
						node: ruleNode,
						index,
						endIndex,
						result,
						ruleName,
					});
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
