import parser from 'postcss-selector-parser';

import { atRuleRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import { isAtRule, isRule } from '../../utils/typeGuards.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import containsNestingSelector from '../../utils/containsNestingSelector.mjs';
import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
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
	expected: (selector, max) => `Too many type selectors in "${selector}", maximum ${max}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-type',
};

/** @import { Rule } from 'postcss' */
/** @import { Node as SelectorNode } from 'postcss-selector-parser' */

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
		 * @param {Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			let count = 0;

			selectorNode.walkTags((childNode) => {
				if (optionsMatches(secondaryOptions, 'ignoreTypes', childNode.value)) {
					return;
				}

				if (
					ignoreDescendant &&
					(hasDescendantCombinatorBefore(childNode) ||
						hasImplicitDescendantCombinator(childNode, ruleNode))
				) {
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

		root.walkRules(mayIncludeRegexes.typeSelector, (ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (ruleNode.selectors.some(isKeyframeSelector)) return;

			const selectors = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			selectors?.each((selector) => {
				checkSelector(selector, ruleNode);
			});
		});
	};
};

/**
 * @param {SelectorNode} node
 * @returns {boolean}
 */
function hasDescendantCombinatorBefore(node) {
	const parent = node.parent;

	if (!parent) return false;

	const nodeIndex = parent.nodes.indexOf(node);

	return parent.nodes.slice(0, nodeIndex).some((n) => isDescendantCombinator(n));
}

/**
 * @param {SelectorNode} node
 * @param {Rule} ruleNode
 * @returns {boolean}
 */
function hasImplicitDescendantCombinator(node, ruleNode) {
	const selector = node.parent;

	if (!parser.isSelector(selector) || !parser.isRoot(selector.parent)) return false;

	if (!isNestedRule(ruleNode)) return false;

	return !containsNestingSelector(selector);
}

/**
 * @param {Rule} ruleNode
 * @returns {boolean}
 */
function isNestedRule(ruleNode) {
	return Boolean(
		findNodeUpToRoot(
			ruleNode,
			(node) => isRule(node) || (isAtRule(node) && atRuleRegexes.scopeName.test(node.name)),
		),
	);
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
	if (node.prev() && !parser.isCombinator(node.prev())) {
		return true;
	}

	if (node.next() && !parser.isCombinator(node.next())) {
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
 * @returns {boolean}
 */
function isDescendantCombinator(node) {
	if (!node) return false;

	return parser.isCombinator(node) && isString(node.value) && isOnlyWhitespace(node.value);
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {boolean}
 */
function isChildCombinator(node) {
	if (!node) return false;

	return parser.isCombinator(node) && node.value === '>';
}

/**
 * @param {SelectorNode | undefined} node
 * @returns {boolean}
 */
function isNextSiblingCombinator(node) {
	return parser.isCombinator(node) && node.value === '+';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
