import selectorParser from 'postcss-selector-parser';

import {
	applicableElementsByPseudoClass,
	elementBackedPseudoElements,
	htmlTypeSelectors,
	treeStructuralPseudoClasses,
} from '../../reference/selectors.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import { groupByCompoundSelectors } from '../../utils/getCompoundSelectors.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isSelectorContainingPseudoClass from '../../utils/isSelectorContainingPseudoClass.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import normalizePseudoName from '../../utils/normalizePseudoName.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-unmatchable';

const messages = ruleMessages(ruleName, {
	rejected: (selector, resolvedSelector, reason) => {
		selector = `"${selector}"${resolvedSelector ? ` ("${resolvedSelector}")` : ''}`;

		return `Unmatchable selector ${selector}${reason ? `, ${reason}` : ''}`;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-unmatchable',
};

/** @import { Container, Node, Pseudo, Root as SelectorRoot, Selector, Tag } from 'postcss-selector-parser' */
/** @import { NonSelector } from '../../utils/getCompoundSelectors.mjs' */

/**
 * @typedef {object} CheckContext
 * @property {Selector} selector
 * @property {SelectorRoot} resolvedSelectors
 * @property {boolean} nested
 * @property {string} resolvedSelector
 * @property {boolean} mayHavePseudoElement
 * @property {() => Array<Array<NonSelector>>} getCompounds
 *
 * @typedef {{ reason: string, index?: number, endIndex?: number }} Problem
 */

const forgivingPseudoClasses = new Set(['is', 'where']);
const negationAndRelationalPseudoClasses = new Set(['has', 'not']);

/** @type {Array<(context: CheckContext) => Problem | undefined>} */
const checks = [
	checkUnrepresentablePseudoElements,
	checkShadow,
	checkPseudoClassingPseudoElements,
	checkApplicableElements,
];

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (isKeyframeRule(ruleNode)) return;

			/**
			 * @param {Problem} problem
			 * @param {CheckContext} context
			 */
			const complain = (problem, { selector, resolvedSelector, nested }) => {
				const { selector: selectorText, index, endIndex } = getStrippedSelectorSource(selector);

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.rejected,
					messageArgs: [selectorText, nested ? resolvedSelector.trim() : '', problem.reason],
					index: nested ? index : (problem.index ?? index),
					endIndex: nested ? endIndex : (problem.endIndex ?? endIndex),
				});
			};

			resolveNestedSelectorsForRule(ruleNode, result).forEach(
				({ selector, resolvedSelectors, nested }) => {
					const resolvedSelector = resolvedSelectors.toString();

					if (!resolvedSelector.includes(':')) return;

					/** @type {Array<Array<NonSelector>> | undefined} */
					let compounds;

					/** @type {CheckContext} */
					const context = {
						selector,
						resolvedSelectors,
						nested,
						resolvedSelector,
						mayHavePseudoElement: mayIncludeRegexes.pseudoElement.test(resolvedSelector),
						getCompounds: () => {
							compounds ??= resolvedSelectors.nodes.flatMap((memberSelector) =>
								groupByCompoundSelectors(memberSelector, { groupNegationArguments: false }).map(
									(compoundNodes) =>
										compoundNodes.filter((node) => !selectorParser.isComment(node)),
								),
							);

							return compounds;
						},
					};

					for (const check of checks) {
						const problem = check(context);

						if (!problem) continue;

						complain(problem, context);
						break;
					}
				},
			);
		});
	};
};

/**
 * Pseudo-elements cannot be represented by `:is()`, `:where()` or `&`;
 * see https://drafts.csswg.org/selectors/#matches
 *
 * @param {CheckContext} context
 * @returns {Problem | undefined}
 */
function checkUnrepresentablePseudoElements({
	selector,
	resolvedSelectors,
	nested,
	mayHavePseudoElement,
}) {
	if (!mayHavePseudoElement) return undefined;

	/** @type {Problem | undefined} */
	let problem;

	selector.walkPseudos((pseudoNode) => {
		if (problem) return false;

		if (!selectorParser.isPseudoElement(pseudoNode)) return;

		const ancestors = getPseudoClassAncestors(pseudoNode);

		if (ancestors.some(isNegationOrRelationalPseudoClass)) return;

		const [nearest] = ancestors;

		if (!nearest) return;

		const nearestName = normalizePseudoName(nearest.value);

		if (forgivingPseudoClasses.has(nearestName)) {
			problem = {
				reason: `pseudo-elements cannot be represented by ":${nearestName}()"`,
				...getNodeRange(pseudoNode),
			};
		}
	});

	if (problem || !nested) return problem;

	return findUnrepresentableNestingSelector(resolvedSelectors);
}

/**
 * The nesting selector cannot represent pseudo-elements
 * see https://drafts.csswg.org/css-nesting/#nest-selector
 *
 * @param {SelectorRoot} resolvedSelectors
 * @returns {Problem | undefined}
 */
function findUnrepresentableNestingSelector(resolvedSelectors) {
	/** @type {Problem | undefined} */
	let problem;

	resolvedSelectors.walkPseudos((pseudoNode) => {
		if (problem) return false;

		if (!selectorParser.isPseudoClass(pseudoNode)) return undefined;

		if (!forgivingPseudoClasses.has(normalizePseudoName(pseudoNode.value))) return undefined;

		if (pseudoNode.nodes.length === 0) return undefined;

		const everySelectorContainsPseudoElement = pseudoNode.nodes.every((selectorNode) =>
			selectorNode.nodes.some((node) => selectorParser.isPseudoElement(node)),
		);

		if (!everySelectorContainsPseudoElement) return undefined;

		problem = { reason: '"&" cannot represent pseudo-elements' };

		return undefined;
	});

	return problem;
}

/**
 * The shadow host is featureless and has no selectable ancestors or siblings
 * see https://drafts.csswg.org/css-shadow-1/#host-selector
 *
 * @param {CheckContext} context
 * @returns {Problem | undefined}
 */
function checkShadow({ resolvedSelectors, resolvedSelector }) {
	if (!mayIncludeRegexes.hostPseudoClass.test(resolvedSelector)) return undefined;

	/** @type {Problem | undefined} */
	let problem;

	resolvedSelectors.walkPseudos((pseudoNode) => {
		if (problem) return false;

		const name = normalizePseudoName(pseudoNode.value);

		if (name === 'slotted' && selectorParser.isPseudoElement(pseudoNode)) {
			if (containsHostPseudoClass(pseudoNode)) {
				problem = {
					reason: 'slotted elements are never the shadow host',
					...getNodeRange(pseudoNode),
				};
			}

			return undefined;
		}

		if (name !== 'host' || !selectorParser.isPseudoClass(pseudoNode)) return undefined;

		if (getPseudoClassAncestors(pseudoNode).some(isNegationOrRelationalPseudoClass)) {
			return undefined;
		}

		const parentSelector = pseudoNode.parent;

		if (!parentSelector) return undefined;

		for (const sibling of parentSelector.nodes) {
			if (sibling === pseudoNode) break;

			if (selectorParser.isCombinator(sibling)) {
				problem = {
					reason: 'the shadow host has no ancestors or siblings in its shadow tree',
					...getNodeRange(pseudoNode),
				};

				return undefined;
			}
		}

		const featureSibling = findCompoundFeatureSibling(pseudoNode);

		if (featureSibling) {
			problem = {
				reason: `"${String(featureSibling).trim()}" never matches the shadow host`,
				...getNodeRange(featureSibling),
			};
		}

		return undefined;
	});

	return problem;
}

/**
 * Tree-structural pseudo-classes must never match pseudo-elements;
 * see https://drafts.csswg.org/selectors/#structural-pseudos
 *
 * @param {CheckContext} context
 * @returns {Problem | undefined}
 */
function checkPseudoClassingPseudoElements({
	resolvedSelector,
	mayHavePseudoElement,
	getCompounds,
}) {
	if (!mayHavePseudoElement) return undefined;

	if (!mayIncludeRegexes.treeStructuralPseudoClass.test(resolvedSelector)) return undefined;

	for (const compoundNodes of getCompounds()) {
		const [firstNode] = compoundNodes;

		if (!selectorParser.isPseudoElement(firstNode)) continue;

		if (elementBackedPseudoElements.has(normalizePseudoName(firstNode.value))) continue;

		const structuralPseudo = compoundNodes.find(
			(node) =>
				selectorParser.isPseudoClass(node) &&
				treeStructuralPseudoClasses.has(normalizePseudoName(node.value)),
		);

		if (structuralPseudo) {
			return {
				reason: `"${structuralPseudo.value}" never matches pseudo-elements`,
				...getNodeRange(structuralPseudo),
			};
		}
	}

	return undefined;
}

/**
 * Some pseudo-classes only match specific elements;
 * see https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes
 *
 * @param {CheckContext} context
 * @returns {Problem | undefined}
 */
function checkApplicableElements({ resolvedSelectors, resolvedSelector, getCompounds }) {
	if (!mayIncludeRegexes.applicableElementPseudoClass.test(resolvedSelector)) return undefined;

	if (hasMultipleCompoundCombinations(resolvedSelectors, resolvedSelector)) return undefined;

	for (const compoundNodes of getCompounds()) {
		const [firstNode] = compoundNodes;

		if (selectorParser.isPseudoElement(firstNode)) continue;

		const applicableElementPseudos = compoundNodes.flatMap((node) => {
			if (!selectorParser.isPseudoClass(node)) return [];

			const elements = applicableElementsByPseudoClass.get(normalizePseudoName(node.value));

			return elements ? [{ node, elements }] : [];
		});

		if (applicableElementPseudos.length === 0) continue;

		const tagNode = compoundNodes.find((node) => selectorParser.isTag(node));
		const tagName = tagNode && getHtmlTypeSelectorName(tagNode);

		if (tagNode && tagName) {
			for (const { node, elements } of applicableElementPseudos) {
				if (!elements.has(tagName)) {
					return {
						reason: `"${node.value}" never matches "${tagNode.value}" elements`,
						...getNodeRange(node),
					};
				}
			}
		}

		for (const [firstIndex, firstEntry] of applicableElementPseudos.entries()) {
			for (const secondEntry of applicableElementPseudos.slice(firstIndex + 1)) {
				if (areDisjointSets(firstEntry.elements, secondEntry.elements)) {
					return {
						reason: `"${firstEntry.node.value}" and "${secondEntry.node.value}" never match the same element`,
						index: firstEntry.node.sourceIndex,
						endIndex: getNodeRange(secondEntry.node).endIndex,
					};
				}
			}
		}
	}

	return undefined;
}

/**
 * Whether `getCompounds` groups the pseudo-class's arguments into its
 * surrounding compound
 *
 * @param {unknown} node
 * @returns {node is Pseudo}
 */
function hasGroupedArguments(node) {
	return isSelectorContainingPseudoClass(node) && !isNegationOrRelationalPseudoClass(node);
}

/**
 * @param {Pseudo} node
 * @returns {boolean}
 */
function isNegationOrRelationalPseudoClass(node) {
	return negationAndRelationalPseudoClasses.has(normalizePseudoName(node.value));
}

/**
 * @param {Node} node
 * @returns {Array<Pseudo>}
 */
function getPseudoClassAncestors(node) {
	/** @type {Array<Pseudo>} */
	const ancestors = [];

	/** @type {Container | Selector | undefined} */
	let selector = node.parent;

	while (selector && selectorParser.isPseudoClass(selector.parent)) {
		ancestors.push(selector.parent);
		selector = selector.parent.parent;
	}

	return ancestors;
}

/**
 * @param {Pseudo} slottedNode
 * @returns {boolean}
 */
function containsHostPseudoClass(slottedNode) {
	return slottedNode.nodes.some((selectorNode) =>
		selectorNode.nodes.some(
			(node) => selectorParser.isPseudoClass(node) && normalizePseudoName(node.value) === 'host',
		),
	);
}

/**
 * @param {Node} node
 * @returns {Node | undefined}
 */
function findCompoundFeatureSibling(node) {
	let sibling = node.prev();

	while (sibling && !selectorParser.isCombinator(sibling)) {
		if (isFeatureSelector(sibling)) return sibling;

		sibling = sibling.prev();
	}

	sibling = node.next();

	while (
		sibling &&
		!selectorParser.isCombinator(sibling) &&
		!selectorParser.isPseudoElement(sibling)
	) {
		if (isFeatureSelector(sibling)) return sibling;

		sibling = sibling.next();
	}

	return undefined;
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isFeatureSelector(node) {
	if (selectorParser.isTag(node)) return isStandardSyntaxTypeSelector(node);

	return (
		selectorParser.isClassName(node) ||
		selectorParser.isIdentifier(node) ||
		selectorParser.isAttribute(node)
	);
}

/**
 * @param {Tag} node
 * @returns {string | undefined}
 */
function getHtmlTypeSelectorName(node) {
	if (node.namespace) return undefined;

	if (!isStandardSyntaxTypeSelector(node)) return undefined;

	const name = node.value.toLowerCase();

	return htmlTypeSelectors.has(name) ? name : undefined;
}

/**
 * @param {SelectorRoot} resolvedSelectors
 * @param {string} resolvedSelector
 * @returns {boolean}
 */
function hasMultipleCompoundCombinations(resolvedSelectors, resolvedSelector) {
	if (!resolvedSelector.includes('(')) return false;

	let found = false;

	resolvedSelectors.walkPseudos((pseudoNode) => {
		if (hasGroupedArguments(pseudoNode) && pseudoNode.nodes.length > 1) {
			found = true;

			return false;
		}

		return undefined;
	});

	return found;
}

/**
 * @param {Node} node
 * @returns {{ index: number, endIndex: number }}
 */
function getNodeRange(node) {
	return {
		index: node.sourceIndex,
		endIndex: node.sourceIndex + String(node).trim().length,
	};
}

// TODO: Replace with `Set.prototype.isDisjointFrom()` when we drop Node.js 20.
/**
 * @param {ReadonlySet<string>} first
 * @param {ReadonlySet<string>} second
 * @returns {boolean}
 */
function areDisjointSets(first, second) {
	for (const member of first) {
		if (second.has(member)) return false;
	}

	return true;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
