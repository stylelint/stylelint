'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-pseudo-element-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-pseudo-element-allowed-list',
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

			const selector = ruleNode.selector;

			if (!selector.includes('::')) {
				return;
			}

			parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					const value = pseudoNode.value;

					// Ignore pseudo-classes
					if (value[1] !== ':') {
						return;
					}

					const name = value.slice(2);

					if (matchesStringOrRegExp(vendor.unprefixed(name), primary)) {
						return;
					}

					report({
						index: pseudoNode.sourceIndex,
						message: messages.rejected(name),
						node: ruleNode,
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
