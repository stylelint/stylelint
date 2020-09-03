// @ts-nocheck

'use strict';

const _ = require('lodash');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const parseSelector = require('../../utils/parseSelector');
const postcss = require('postcss');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-pseudo-element-blacklist';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
});

function rule(list) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [_.isString, _.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		result.warn(
			`'${ruleName}' has been deprecated. Instead use 'selector-pseudo-element-disallowed-list'.`,
			{
				stylelintType: 'deprecation',
				stylelintReference: `https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${ruleName}/README.md`,
			},
		);

		root.walkRules((rule) => {
			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			const selector = rule.selector;

			if (!selector.includes('::')) {
				return;
			}

			parseSelector(selector, result, rule, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					const value = pseudoNode.value;

					// Ignore pseudo-classes
					if (value[1] !== ':') {
						return;
					}

					const name = value.slice(2);

					if (!matchesStringOrRegExp(postcss.vendor.unprefixed(name), list)) {
						return;
					}

					report({
						index: pseudoNode.sourceIndex,
						message: messages.rejected(name),
						node: rule,
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
