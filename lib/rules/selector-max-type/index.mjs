import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isCustomElement from '../../utils/isCustomElement.mjs';
import isKeyframeSelector from '../../utils/isKeyframeSelector.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isOnlyWhitespace from '../../utils/isOnlyWhitespace.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-type';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} type ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-type',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
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
					ignore: ['descendant', 'child', 'compounded', 'next-sibling', 'custom-elements'],
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
		const ignoreCustomElements = optionsMatches(secondaryOptions, 'ignore', 'custom-elements');

		/**
		 * @param {import('postcss-selector-parser').Selector} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			let count = 0;

			selectorNode.walkTags((childNode) => {
				if (optionsMatches(secondaryOptions, 'ignoreTypes', childNode.value)) {
					return;
				}

				if (ignoreDescendant && hasDescendantCombinatorBefore(childNode)) {
					return;
				}

				if (ignoreChild && hasChildCombinatorBefore(childNode)) {
					return;
				}

				if (ignoreCompounded && hasCompoundSelector(childNode)) {
					return;
				}

				if (ignoreNextSibling && hasNextSiblingCombinator(childNode)) {
					return;
				}

				if (ignoreCustomElements && childNode.value && isCustomElement(childNode.value)) {
					return;
				}

				if (!isStandardSyntaxTypeSelector(childNode)) {
					return;
				}

				count += 1;
			});

			if (count > primary) {
				const { selector, index, endIndex } = getStrippedSelectorSource(selectorNode);

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selector, primary],
					index,
					endIndex,
				});
			}
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (ruleNode.selectors.some(isKeyframeSelector)) return;

			const selectors = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			selectors?.each((selector) => {
				checkSelector(selector, ruleNode);
			});
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

	if (node.next() && !isCombinator(node.next())) {
		return true;
	}

	return false;
}

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasNextSiblingCombinator(node) {
	return isNextSiblingCombinator(node.prev());
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {node is import('postcss-selector-parser').Combinator}
 */
function isCombinator(node) {
	if (!node) return false;

	return node.type === 'combinator';
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {boolean}
 */
function isDescendantCombinator(node) {
	if (!node) return false;

	return isCombinator(node) && isString(node.value) && isOnlyWhitespace(node.value);
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {boolean}
 */
function isChildCombinator(node) {
	if (!node) return false;

	return isCombinator(node) && node.value === '>';
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {boolean}
 */
function isNextSiblingCombinator(node) {
	return isCombinator(node) && node.value === '+';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
