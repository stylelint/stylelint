'use strict';

const selectors = require('../../reference/selectors.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const typeGuards = require('../../utils/typeGuards.cjs');
const isCustomSelector = require('../../utils/isCustomSelector.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'selector-pseudo-class-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown pseudo-class selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-class-no-unknown',
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
					ignorePseudoClasses: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {string} selector
		 * @param {import('postcss').ChildNode} node
		 */
		function check(selector, node) {
			parseSelector(selector, result, node, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					const value = pseudoNode.value;

					if (!isStandardSyntaxSelector(value)) {
						return;
					}

					if (isCustomSelector(value)) {
						return;
					}

					if (value.startsWith('::')) {
						return;
					}

					const name = value.replace(/^:*/, '').toLowerCase();

					if (selectors.levelOneAndTwoPseudoElements.has(name)) {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoNode.value.slice(1))) {
						return;
					}

					const hasVendorPrefix = vendor.prefix(name);
					let index = null;

					if (typeGuards.isAtRule(node) && node.name === 'page') {
						if (selectors.atRulePagePseudoClasses.has(name)) {
							return;
						}

						index = atRuleParamIndex(node) + pseudoNode.sourceIndex;
					} else if (selectors.pseudoElements.has(name) && !hasVendorPrefix) {
						index = pseudoNode.sourceIndex;
					} else {
						if (hasVendorPrefix || selectors.pseudoClasses.has(name)) {
							return;
						}

						/** @type {import('postcss-selector-parser').Base} */
						let prevPseudoElement = pseudoNode;

						do {
							prevPseudoElement = /** @type {import('postcss-selector-parser').Base} */ (
								prevPseudoElement.prev()
							);

							if (prevPseudoElement && prevPseudoElement.value.slice(0, 2) === '::') {
								break;
							}
						} while (prevPseudoElement);

						if (prevPseudoElement) {
							const prevPseudoElementValue = prevPseudoElement.value.toLowerCase().slice(2);

							if (
								selectors.webkitScrollbarPseudoElements.has(prevPseudoElementValue) &&
								selectors.webkitScrollbarPseudoClasses.has(name)
							) {
								return;
							}
						}

						index = pseudoNode.sourceIndex;
					}

					report({
						message: messages.rejected,
						messageArgs: [value],
						node,
						index,
						ruleName,
						result,
						word: value,
					});
				});
			});
		}

		root.walk((node) => {
			let selector = null;

			if (node.type === 'rule') {
				if (!isStandardSyntaxRule(node)) {
					return;
				}

				selector = node.selector;
			} else if (typeGuards.isAtRule(node) && node.name === 'page' && node.params) {
				if (!isStandardSyntaxAtRule(node)) {
					return;
				}

				selector = node.params;
			}

			// Return if selector empty, it is meaning node type is not a rule or a at-rule

			if (!selector) {
				return;
			}

			// Return early before parse if no pseudos for performance

			if (!selector.includes(':')) {
				return;
			}

			check(selector, node);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;