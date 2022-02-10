'use strict';

const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass');
const isKeyframeSelector = require('../../utils/isKeyframeSelector');
const isNonNegativeInteger = require('../../utils/isNonNegativeInteger');
const isOnlyWhitespace = require('../../utils/isOnlyWhitespace');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const isStandardSyntaxTypeSelector = require('../../utils/isStandardSyntaxTypeSelector');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-max-type';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} type ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-max-type',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isNonNegativeInteger,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['descendant', 'child', 'compounded', 'next-sibling'],
					ignoreTypes: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreDescendant = optionsMatches(secondaryOptions, 'ignore', 'descendant');
		const ignoreChild = optionsMatches(secondaryOptions, 'ignore', 'child');
		const ignoreCompounded = optionsMatches(secondaryOptions, 'ignore', 'compounded');
		const ignoreNextSibling = optionsMatches(secondaryOptions, 'ignore', 'next-sibling');

		/**
		 * @param {import('postcss-selector-parser').Container<unknown>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			const count = selectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, ruleNode);
				}

				if (optionsMatches(secondaryOptions, 'ignoreTypes', childNode.value)) {
					return total;
				}

				if (ignoreDescendant && hasDescendantCombinatorBefore(childNode)) {
					return total;
				}

				if (ignoreChild && hasChildCombinatorBefore(childNode)) {
					return total;
				}

				if (ignoreCompounded && hasCompoundSelector(childNode)) {
					return total;
				}

				if (ignoreNextSibling && hasNextSiblingCombinator(childNode)) {
					return total;
				}

				if (childNode.type === 'tag' && !isStandardSyntaxTypeSelector(childNode)) {
					return total;
				}

				return childNode.type === 'tag' ? total + 1 : total;
			}, 0);

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && count > primary) {
				const selector = selectorNode.toString();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected(selector, primary),
					word: selector,
				});
			}
		}

		root.walkRules((ruleNode) => {
			const selectors = ruleNode.selectors;

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (selectors.some((s) => isKeyframeSelector(s))) {
				return;
			}

			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					if (!isStandardSyntaxSelector(resolvedSelector)) {
						continue;
					}

					parseSelector(resolvedSelector, result, ruleNode, (container) =>
						checkSelector(container, ruleNode),
					);
				}
			}
		});
	};
};

/** @typedef {import('postcss-selector-parser').Node} SelectorNode */

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasDescendantCombinatorBefore(node) {
	if (!node.parent) return false;

	const nodeIndex = node.parent.nodes.indexOf(node);

	return node.parent.nodes.slice(0, nodeIndex).some((n) => isDescendantCombinator(n));
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasChildCombinatorBefore(node) {
	if (!node.parent) return false;

	const nodeIndex = node.parent.nodes.indexOf(node);

	return node.parent.nodes.slice(0, nodeIndex).some((n) => isChildCombinator(n));
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasCompoundSelector(node) {
	if (node.prev() && !isCombinator(node.prev())) {
		return true;
	}

	return node.next() && !isCombinator(node.next());
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasNextSiblingCombinator(node) {
	return node.prev() && isNextSiblingCombinator(node.prev());
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function isCombinator(node) {
	if (!node) return false;

	return node.type === 'combinator';
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function isDescendantCombinator(node) {
	if (!node) return false;

	return isCombinator(node) && isString(node.value) && isOnlyWhitespace(node.value);
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function isChildCombinator(node) {
	if (!node) return false;

	return isCombinator(node) && node.value === '>';
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function isNextSiblingCombinator(node) {
	return isCombinator(node) && node.value === '+';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
