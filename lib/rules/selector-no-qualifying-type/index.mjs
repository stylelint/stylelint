import selectorParser from 'postcss-selector-parser';

import getCompoundSelectors from './getCompoundSelectors.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isSelectorContainingPseudoClass from './isSelectorContainingPseudoClass.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-qualifying-type';

const messages = ruleMessages(ruleName, {
	rejected: (selector, type) => {
		return `Disallowed qualifying type selector "${type}" in "${selector}"`;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-qualifying-type',
};

/** @import { Node, Selector, Root } from 'postcss-selector-parser' */

/**
 * @typedef {Exclude<Node, Selector>} NonSelector
 */

/**
 * @param {Node} node
 * @returns {Array<Node>}
 */
function getOriginalCompound(node) {
	const container = node.parent?.parent;

	if (isSelectorContainingPseudoClass(container)) {
		return getOriginalCompound(container);
	}

	/** @type {Array<Node>} */
	const result = [node];

	/** @type {Node | undefined} */
	let leftNode = node;

	while ((leftNode = leftNode.prev())) {
		if (selectorParser.isCombinator(leftNode) || selectorParser.isPseudoElement(leftNode)) {
			break;
		}

		if (selectorParser.isComment(leftNode)) {
			continue;
		}

		result.push(leftNode);
	}

	result.reverse();

	/** @type {Node | undefined} */
	let rightNode = node;

	while ((rightNode = rightNode.next())) {
		if (selectorParser.isCombinator(rightNode) || selectorParser.isPseudoElement(rightNode)) {
			break;
		}

		if (selectorParser.isComment(rightNode)) {
			continue;
		}

		result.push(rightNode);
	}

	while ((rightNode = result.at(-1))) {
		if (
			selectorParser.isIdentifier(rightNode) ||
			selectorParser.isClassName(rightNode) ||
			selectorParser.isAttribute(rightNode) ||
			selectorParser.isTag(rightNode)
		) {
			break;
		}

		if (isSelectorContainingPseudoClass(rightNode)) {
			break;
		}

		result.splice(-1, 1);
	}

	return result;
}

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [true],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['attribute', 'class', 'id'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreId = optionsMatches(secondaryOptions, 'ignore', 'id');
		const ignoreClass = optionsMatches(secondaryOptions, 'ignore', 'class');
		const ignoreAttribute = optionsMatches(secondaryOptions, 'ignore', 'attribute');

		root.walkRules(mayIncludeRegexes.idClassAttributeSelector, (ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (isKeyframeRule(ruleNode)) {
				return;
			}

			/**
			 * @param {Root} resolvedSelectorNode
			 * @param {Selector} selectorNode
			 * @param {boolean} nested
			 */
			function checkSelector(resolvedSelectorNode, selectorNode, nested) {
				const { compoundSelectors, lookupMap } = getCompoundSelectors(resolvedSelectorNode);

				compoundSelectors.walkTags((tagNode) => {
					const originalTag = lookupMap.get(tagNode);

					if (!originalTag) return;

					if (!isStandardSyntaxTypeSelector(originalTag)) return;

					const selectorParent = tagNode.parent;

					if (!selectorParent || selectorParent.nodes.length === 1) {
						return;
					}

					const siblingNodes = selectorParent.nodes;

					const originalCompound = getOriginalCompound(originalTag);

					for (const siblingNode of siblingNodes) {
						if (
							(selectorParser.isIdentifier(siblingNode) && !ignoreId) ||
							(selectorParser.isClassName(siblingNode) && !ignoreClass) ||
							(selectorParser.isAttribute(siblingNode) && !ignoreAttribute)
						) {
							const selector = originalCompound.join('').trim();

							let index;
							let endIndex;

							if (nested) {
								({ index, endIndex } = getStrippedSelectorSource(selectorNode));
							} else {
								index = tagNode.sourceIndex ?? 0;
								endIndex = index + tagNode.value.length;
							}

							report({
								ruleName,
								result,
								node: ruleNode,
								message: messages.rejected,
								messageArgs: [selector, tagNode.value],
								index,
								endIndex,
							});

							break;
						}
					}
				});
			}

			resolveNestedSelectorsForRule(ruleNode, result).forEach(
				({ selector, resolvedSelectors, nested }) => {
					checkSelector(resolvedSelectors, selector, nested);
				},
			);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
