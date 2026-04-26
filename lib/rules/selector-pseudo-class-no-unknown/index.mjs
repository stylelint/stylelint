import {
	atRulePagePseudoClasses,
	levelOneAndTwoPseudoElements,
	pseudoClasses,
	pseudoElements,
	webkitScrollbarPseudoClasses,
	webkitScrollbarPseudoElements,
} from '../../reference/selectors.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import { isAtRule } from '../../utils/typeGuards.mjs';
import isCustomSelector from '../../utils/isCustomSelector.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'selector-pseudo-class-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unknown pseudo-class selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-class-no-unknown',
};

/**
 * @param {import('postcss-selector-parser').Pseudo} pseudoNode
 * @returns {boolean}
 */
function isWebkitScrollbarPseudoElement(pseudoNode) {
	const name = pseudoNode.value.toLowerCase().slice(2);

	return pseudoNode.value.startsWith('::') && webkitScrollbarPseudoElements.has(name);
}

/**
 * @param {import('postcss-selector-parser').Selector} selectorNode
 * @returns {boolean}
 */
function selectorEndsWithWebkitScrollbarPseudoElement(selectorNode) {
	/** @type {import('postcss-selector-parser').Node | undefined} */
	let current = selectorNode.last;

	while (current) {
		if (current.type === 'combinator') return false;

		if (current.type === 'pseudo' && current.value.startsWith('::')) {
			return isWebkitScrollbarPseudoElement(current);
		}

		current = current.prev();
	}

	return false;
}

/**
 * @param {import('postcss-selector-parser').Pseudo} pseudoNode
 * @returns {boolean}
 */
function isNestedParentWebkitScrollbarPseudoElement(pseudoNode) {
	if (pseudoNode.value !== ':is' || !pseudoNode.nodes?.length) return false;

	return pseudoNode.nodes.every(selectorEndsWithWebkitScrollbarPseudoElement);
}

/**
 * @param {import('postcss-selector-parser').Pseudo} pseudoNode
 * @returns {boolean}
 */
function hasPreviousWebkitScrollbarPseudoElement(pseudoNode) {
	/** @type {import('postcss-selector-parser').Node | undefined} */
	let prevNode = pseudoNode;

	do {
		prevNode = prevNode.prev();

		if (prevNode?.type === 'pseudo') {
			if (prevNode.value.startsWith('::')) return isWebkitScrollbarPseudoElement(prevNode);

			if (isNestedParentWebkitScrollbarPseudoElement(prevNode)) return true;
		}
	} while (prevNode);

	return false;
}

/**
 * @param {import('postcss-selector-parser').Pseudo} a
 * @param {import('postcss-selector-parser').Pseudo} b
 * @returns {boolean}
 */
function isSameSourcePseudo(a, b) {
	return (
		a.value === b.value &&
		a.sourceIndex === b.sourceIndex &&
		a.source?.start?.line === b.source?.start?.line &&
		a.source?.start?.column === b.source?.start?.column &&
		a.source?.end?.line === b.source?.end?.line &&
		a.source?.end?.column === b.source?.end?.column
	);
}

/**
 * @param {import('postcss-selector-parser').Pseudo} pseudoNode
 * @param {import('postcss-selector-parser').Root | undefined} resolvedSelectors
 * @returns {boolean}
 */
function hasResolvedWebkitScrollbarPseudoElement(pseudoNode, resolvedSelectors) {
	let result = false;

	resolvedSelectors?.walkPseudos((resolvedPseudoNode) => {
		if (result || !isSameSourcePseudo(pseudoNode, resolvedPseudoNode)) return;

		result = hasPreviousWebkitScrollbarPseudoElement(resolvedPseudoNode);
	});

	return result;
}

/** @type {import('stylelint').CoreRules[ruleName]} */
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
		 * @param {import('postcss-selector-parser').Root | import('postcss-selector-parser').Selector} selectorNode
		 * @param {import('postcss').ChildNode} node
		 * @param {import('postcss-selector-parser').Root | undefined} resolvedSelectors
		 */
		function check(selectorNode, node, resolvedSelectors) {
			selectorNode.walkPseudos((pseudoNode) => {
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

				if (levelOneAndTwoPseudoElements.has(name)) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoNode.value.slice(1))) {
					return;
				}

				const hasVendorPrefix = vendor.prefix(name);
				let index;

				if (isAtRule(node) && node.name === 'page') {
					if (atRulePagePseudoClasses.has(name)) {
						return;
					}

					index = atRuleParamIndex(node) + pseudoNode.sourceIndex;
				} else if (pseudoElements.has(name) && !hasVendorPrefix) {
					index = pseudoNode.sourceIndex;
				} else {
					if (hasVendorPrefix || pseudoClasses.has(name)) {
						return;
					}

					if (
						webkitScrollbarPseudoClasses.has(name) &&
						(hasPreviousWebkitScrollbarPseudoElement(pseudoNode) ||
							hasResolvedWebkitScrollbarPseudoElement(pseudoNode, resolvedSelectors))
					) {
						return;
					}

					index = pseudoNode.sourceIndex;
				}

				const endIndex = index + pseudoNode.value.length;

				report({
					message: messages.rejected,
					messageArgs: [value],
					node,
					index,
					endIndex,
					ruleName,
					result,
				});
			});
		}

		root.walk((node) => {
			let selector = null;

			if (node.type === 'rule') {
				if (!isStandardSyntaxRule(node)) {
					return;
				}

				selector = getRuleSelector(node);

				if (!selector?.includes(':')) {
					return;
				}

				resolveNestedSelectorsForRule(node, result).forEach(
					({ selector: selectorNode, resolvedSelectors }) => {
						check(selectorNode, node, resolvedSelectors);
					},
				);

				return;
			}

			if (isAtRule(node) && node.name === 'page' && node.params) {
				if (!isStandardSyntaxAtRule(node)) {
					return;
				}

				selector = getAtRuleParams(node);
			}

			// Return if selector empty, it is meaning node type is not a rule or a at-rule

			if (!selector) {
				return;
			}

			// Return early before parse if no pseudos for performance

			if (!selector.includes(':')) {
				return;
			}

			const selectorRoot = parseSelector(selector, result, node);

			if (!selectorRoot) {
				return;
			}

			check(selectorRoot, node, undefined);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
