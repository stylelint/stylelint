'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const selectors = require('../../reference/selectors.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'selector-pseudo-element-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown pseudo-element selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-no-unknown',
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
					ignorePseudoElements: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			const selector = ruleNode.selector;

			// Return early before parse if no pseudos for performance

			if (!selector.includes(':')) {
				return;
			}

			if (!isStandardSyntaxRule(ruleNode)) {
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

					if (vendor.prefix(name) || selectors.pseudoElements.has(name.toLowerCase())) {
						return;
					}

					report({
						message: messages.rejected,
						messageArgs: [value],
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