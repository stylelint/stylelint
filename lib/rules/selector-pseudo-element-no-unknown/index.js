'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'selector-pseudo-element-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown pseudo-element selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-pseudo-element-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignorePseudoElements: [isString],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			// Return early before parse if no pseudos for performance

			if (!selector.includes(':')) {
				return;
			}

			parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					const value = pseudoNode.value;

					if (!isStandardSyntaxSelector(value)) {
						return;
					}

					// Ignore pseudo-classes
					if (value.slice(0, 2) !== '::') {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignorePseudoElements', pseudoNode.value.slice(2))) {
						return;
					}

					const name = value.slice(2);

					if (vendor.prefix(name) || keywordSets.pseudoElements.has(name.toLowerCase())) {
						return;
					}

					report({
						message: messages.rejected(value),
						node: ruleNode,
						index: pseudoNode.sourceIndex,
						ruleName,
						result,
						word: value,
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
