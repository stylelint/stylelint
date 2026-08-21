import selectorParser from 'postcss-selector-parser';

import {
	applicableElementsByPseudoClass,
	elementRepresentingPseudoElements,
	htmlTypeSelectors,
	treeStructuralPseudoClasses,
} from '../../reference/selectors.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import { groupByCompoundSelectors } from '../../utils/getCompoundSelectors.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
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
 */

const forgivingPseudoClasses = new Set(['is', 'where']);
const negationAndRelationalPseudoClasses = new Set(['has', 'not']);

/** @type {Array<(context: CheckContext) => string | undefined>} */
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
			 * @param {string} reason
			 * @param {CheckContext} context
			 */
			const complain = (reason, { selector, resolvedSelector, nested }) => {
				const { selector: selectorText, index, endIndex } = getStrippedSelectorSource(selector);

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.rejected,
					messageArgs: [selectorText, nested ? resolvedSelector.trim() : '', reason],
					index,
					endIndex,
				});
			};

			for (const { selector, resolvedSelectors, nested } of resolveNestedSelectorsForRule(
				ruleNode,
				result,
			)) {
				const resolvedSelector = resolvedSelectors.toString();

				if (!resolvedSelector.includes(':')) continue;

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
								(compoundNodes) => compoundNodes.filter((node) => !selectorParser.isComment(node)),
							),
						);

						return compounds;
					},
				};

				for (const check of checks) {
					const reason = check(context);

					if (!reason) continue;

					complain(reason, context);
					break;
				}
			}
		});
	};
};

/**
 * Pseudo-elements cannot be represented by `:is()`, `:where()` or `&`;
 * see https://drafts.csswg.org/selectors/#matches
 *
 * @param {CheckContext} context
 * @returns {string | undefined}
 */
function checkUnrepresentablePseudoElements({
	selector,
	resolvedSelectors,
	nested,
	mayHavePseudoElement,
}) {
	if (!mayHavePseudoElement) return undefined;

	/** @type {string | undefined} */
	let reason;

	selector.walkPseudos((pseudoNode) => {
		if (reason) return false;

		if (!selectorParser.isPseudoElement(pseudoNode)) return;

		const ancestors = getPseudoClassAncestors(pseudoNode);

		if (ancestors.some(isNegationOrRelationalPseudoClass)) return;

		const [nearest] = ancestors;

		if (!nearest) return;

		const nearestName = normalizePseudoName(nearest.value);

		if (forgivingPseudoClasses.has(nearestName)) {
			reason = `pseudo-elements cannot be represented by ":${nearestName}()"`;
		}
	});

	if (reason || !nested) return reason;

	return findUnrepresentableNestingSelector(resolvedSelectors);
}

/**
 * The nesting selector cannot represent pseudo-elements
 * see https://drafts.csswg.org/css-nesting/#nest-selector
 *
 * @param {SelectorRoot} resolvedSelectors
 * @returns {string | undefined}
 */
function findUnrepresentableNestingSelector(resolvedSelectors) {
	/** @type {string | undefined} */
	let reason;

	resolvedSelectors.walkPseudos((pseudoNode) => {
		if (reason) return false;

		if (!selectorParser.isPseudoClass(pseudoNode)) return;

		if (!forgivingPseudoClasses.has(normalizePseudoName(pseudoNode.value))) return;

		if (getPseudoClassAncestors(pseudoNode).some(isNegationOrRelationalPseudoClass)) return;

		const someSelectorContainsPseudoElement = pseudoNode.nodes.some((selectorNode) =>
			selectorNode.nodes.some(selectorParser.isPseudoElement),
		);

		if (!someSelectorContainsPseudoElement) return;

		reason = '"&" cannot represent pseudo-elements';

		return false;
	});

	return reason;
}

/**
 * The shadow host is featureless and has no selectable ancestors or siblings
 * see https://drafts.csswg.org/css-shadow-1/#host-selector
 *
 * @param {CheckContext} context
 * @returns {string | undefined}
 */
function checkShadow({ resolvedSelectors, resolvedSelector }) {
	if (!mayIncludeRegexes.hostPseudoClass.test(resolvedSelector)) return undefined;

	/** @type {string | undefined} */
	let reason;

	resolvedSelectors.walkPseudos((pseudoNode) => {
		if (reason) return false;

		const name = normalizePseudoName(pseudoNode.value);

		if (name === 'slotted' && selectorParser.isPseudoElement(pseudoNode)) {
			if (containsHostPseudoClass(pseudoNode)) {
				reason = 'slotted elements are never the shadow host';
			}

			return false;
		}

		if (name !== 'host' || !selectorParser.isPseudoClass(pseudoNode)) return;

		if (getPseudoClassAncestors(pseudoNode).some(isNegationOrRelationalPseudoClass)) {
			return;
		}

		const parentSelector = pseudoNode.parent;

		if (!parentSelector) return;

		for (const sibling of parentSelector.nodes) {
			if (sibling === pseudoNode) break;

			if (selectorParser.isCombinator(sibling)) {
				reason = 'the shadow host has no ancestors or siblings in its shadow tree';

				return false;
			}
		}

		const featureSibling = findCompoundFeatureSibling(pseudoNode);

		if (featureSibling) {
			reason = `"${String(featureSibling).trim()}" never matches the shadow host`;

			return false;
		}
	});

	return reason;
}

/**
 * Tree-structural pseudo-classes must never match pseudo-elements;
 * see https://drafts.csswg.org/selectors/#structural-pseudos
 *
 * @param {CheckContext} context
 * @returns {string | undefined}
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

		if (elementRepresentingPseudoElements.has(normalizePseudoName(firstNode.value))) continue;

		const structuralPseudo = compoundNodes.find(
			(node) =>
				selectorParser.isPseudoClass(node) &&
				treeStructuralPseudoClasses.has(normalizePseudoName(node.value)),
		);

		if (structuralPseudo) {
			return `"${structuralPseudo.value}" never matches pseudo-elements`;
		}
	}

	return undefined;
}

/**
 * Some pseudo-classes only match specific elements;
 * see https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes
 *
 * @param {CheckContext} context
 * @returns {string | undefined}
 */
function checkApplicableElements({ resolvedSelector, getCompounds }) {
	if (!mayIncludeRegexes.applicableElementPseudoClass.test(resolvedSelector)) return undefined;

	for (const compoundNodes of getCompounds()) {
		const [firstNode] = compoundNodes;

		if (selectorParser.isPseudoElement(firstNode)) continue;

		const applicableElementPseudos = compoundNodes.flatMap((node) => {
			if (!selectorParser.isPseudoClass(node)) return [];

			const elements = applicableElementsByPseudoClass.get(normalizePseudoName(node.value));

			return elements ? [{ node, elements }] : [];
		});

		if (applicableElementPseudos.length === 0) continue;

		const tagNode = compoundNodes.find(selectorParser.isTag);
		const tagName = tagNode && getHtmlTypeSelectorName(tagNode);

		if (tagNode && tagName) {
			for (const { node, elements } of applicableElementPseudos) {
				if (!elements.has(tagName)) {
					return `"${node.value}" never matches "${tagNode.value}" elements`;
				}
			}
		}

		for (const [firstIndex, firstEntry] of applicableElementPseudos.entries()) {
			for (const secondEntry of applicableElementPseudos.slice(firstIndex + 1)) {
				if (areDisjointSets(firstEntry.elements, secondEntry.elements)) {
					return `"${firstEntry.node.value}" and "${secondEntry.node.value}" never match the same element`;
				}
			}
		}
	}

	return undefined;
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
