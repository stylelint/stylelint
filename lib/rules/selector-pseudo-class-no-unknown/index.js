'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isCustomSelector = require('../../utils/isCustomSelector');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const {
	atRulePagePseudoClasses,
	pseudoClasses,
	pseudoElements,
	webkitScrollbarPseudoClasses,
	webkitScrollbarPseudoElements,
} = require('../../reference/selectors');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString, isRegExp } = require('../../utils/validateTypes');
const { isAtRule } = require('../../utils/typeGuards');

const ruleName = 'selector-pseudo-class-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown pseudo-class selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-pseudo-class-no-unknown',
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
					ignorePseudoClasses: [isString, isRegExp],
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

					// Ignore pseudo-elements
					if (value.slice(0, 2) === '::') {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoNode.value.slice(1))) {
						return;
					}

					let index = null;
					const name = value.slice(1).toLowerCase();

					if (isAtRule(node) && node.name === 'page') {
						if (atRulePagePseudoClasses.has(name)) {
							return;
						}

						index = atRuleParamIndex(node) + pseudoNode.sourceIndex;
					} else {
						if (vendor.prefix(name) || pseudoClasses.has(name) || pseudoElements.has(name)) {
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
								webkitScrollbarPseudoElements.has(prevPseudoElementValue) &&
								webkitScrollbarPseudoClasses.has(name)
							) {
								return;
							}
						}

						index = pseudoNode.sourceIndex;
					}

					report({
						message: messages.rejected(value),
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
			} else if (isAtRule(node) && node.name === 'page' && node.params) {
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
