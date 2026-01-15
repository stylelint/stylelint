import selectorParser from 'postcss-selector-parser';

import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import { logicalCombinationsPseudoClasses } from '../../reference/selectors.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-qualifying-type';

const messages = ruleMessages(ruleName, {
	rejected: (selector, type) => {
		return `Unexpected qualifying type selector "${type}" in "${selector}"`;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-qualifying-type',
};

const HAS_ID_CLASS_ATTRIBUTE_PREFIXES = /[#.[]/;

const SELECTOR_CONTAINING_PSEUDO_CLASSES = new Set(
	[...logicalCombinationsPseudoClasses, 'host'].map((s) => `:${s}`),
);

/** @import { Tag, Node, Selector, Root } from 'postcss-selector-parser' */

/**
 * @typedef {Exclude<Node, Selector>} NonSelector
 */

/**
 * @param {unknown} node
 * @returns {node is selectorParser.Pseudo}
 */
function isSelectorContainingPseudoClass(node) {
	return (
		selectorParser.isPseudoClass(node) &&
		SELECTOR_CONTAINING_PSEUDO_CLASSES.has(node.value) &&
		Boolean(node.nodes.length)
	);
}

/**
 * @param {Root} root
 * @returns {{compoundSelectors: Root, lookupMap: Map<Tag, Tag>}}
 */
function getCompoundSelectors(root) {
	const compoundSelectors = selectorParser.root({
		source: root.source,
		sourceIndex: root.sourceIndex,
		value: '',
		nodes: [],
	});

	/** @type {Map<Tag, Tag>} */
	const lookupMap = new Map();

	root.each((selector) => {
		groupByCompoundSelectors(selector).forEach((compoundSelector) => {
			const selectorClone = selector.clone({
				nodes: [],
			});

			compoundSelector.forEach((node) => {
				const clone = node.clone();

				if (selectorParser.isTag(node)) {
					lookupMap.set(/** @type {typeof node} */ (clone), node);
				}

				selectorClone.append(clone);
			});

			compoundSelectors.append(selectorClone);
		});
	});

	return {
		compoundSelectors,
		lookupMap,
	};
}

/**
 * @param {Selector} selector
 * @returns {Array<Array<NonSelector>>}
 */
function groupByCompoundSelectors(selector) {
	/** @type {Array<Array<NonSelector>>} */
	const compoundSelectors = [];
	/** @type {Array<Array<NonSelector>>} */
	let currentCompoundSelectors = [[]];

	selector.each((node) => {
		if (selectorParser.isCombinator(node)) {
			compoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];

			return;
		}

		if (selectorParser.isPseudoElement(node)) {
			compoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];
		}

		if (isSelectorContainingPseudoClass(node)) {
			/** @type {Array<Array<NonSelector>>} */
			const compoundSelectorsCombinations = [];

			node.each((childSelector) => {
				const childCompounds = groupByCompoundSelectors(childSelector);

				const rightMost = childCompounds.at(-1);

				if (!rightMost) return;

				const remainder = childCompounds.slice(0, -1);

				compoundSelectors.push(...remainder);

				currentCompoundSelectors.forEach((compoundSelector) => {
					compoundSelectorsCombinations.push([...compoundSelector, ...rightMost]);
				});
			});

			currentCompoundSelectors = compoundSelectorsCombinations;

			return;
		}

		currentCompoundSelectors.forEach((compoundSelector) => {
			compoundSelector.push(node);
		});
	});

	if (currentCompoundSelectors.length) {
		compoundSelectors.push(...currentCompoundSelectors);
	}

	return compoundSelectors;
}

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

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (isKeyframeRule(ruleNode)) {
				return;
			}

			if (!HAS_ID_CLASS_ATTRIBUTE_PREFIXES.test(ruleNode.selector)) {
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

							let index = 0;
							let endIndex = 0;

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
