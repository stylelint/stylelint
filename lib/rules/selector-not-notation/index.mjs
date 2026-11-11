import selectorParser from 'postcss-selector-parser';
const { isAttribute, isClassName, isIdentifier, isPseudoClass, isTag, isUniversal } =
	selectorParser;

import { assert } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setRuleSelector from '../../utils/setRuleSelector.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-not-notation';
const messages = ruleMessages(ruleName, {
	expected: (type) => `Expected ${type} :not() pseudo-class notation`,
});
const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-not-notation',
	fixable: true,
};

/** @import { Node, Selector, Pseudo, Root } from 'postcss-selector-parser' */
/** @import { Rule } from 'postcss' */

/**
 * @param {Node} node
 * @returns {boolean}
 */
const isSimpleSelector = (node) =>
	isPseudoClass(node) ||
	isAttribute(node) ||
	isClassName(node) ||
	isUniversal(node) ||
	isIdentifier(node) ||
	isTag(node);

/**
 * @param {Node | undefined} node
 * @returns {node is Pseudo}
 */
const isNot = (node) =>
	isPseudoClass(node) && node.value !== undefined && node.value.toLowerCase() === ':not';

/**
 * @param {Selector[]} list
 * @returns {boolean}
 */
const isSimple = (list) => {
	if (list.length > 1) return false;

	assert(list[0], 'list is never empty');
	const [first, second] = list[0].nodes;

	if (!first) return true;

	if (second) return false;

	return isSimpleSelector(first) && !isNot(first);
};

/**
 * An empty selector can always be removed
 * @param {Selector[]} list
 * @returns {boolean}
 */
const isFixable = (list) =>
	list.length > 1 &&
	(list.some(({ nodes }) => nodes.length === 0) || list.every(({ nodes }) => nodes.length <= 1));

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['simple', 'complex'],
		});

		if (!validOptions) return;

		root.walkRules(mayIncludeRegexes.notPseudoClass, (ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selectorRoot = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			if (!selectorRoot) return;

			selectorRoot.walkPseudos((pseudo) => {
				if (!isNot(pseudo)) return;

				const index = pseudo.sourceIndex;
				const endIndex = index + pseudo.toString().trim().length;

				let fix;

				if (primary === 'complex') {
					const prev = pseudo.prev();
					const hasConsecutiveNot = prev && isNot(prev);

					if (!hasConsecutiveNot) return;

					fix = () => fixComplex(prev, ruleNode, selectorRoot);
				} else {
					const selectors = pseudo.nodes;

					if (isSimple(selectors)) return;

					if (isFixable(selectors)) fix = () => fixSimple(pseudo, ruleNode, selectorRoot);
				}

				report({
					message: messages.expected,
					messageArgs: [primary],
					node: ruleNode,
					result,
					ruleName,
					index,
					endIndex,
					fix: {
						apply: fix,
						node: ruleNode,
					},
				});
			});
		});
	};
};

/**
 * @param {Pseudo} not
 * @returns {Node}
 */
const getLastConsecutiveNot = ({ parent, sourceIndex }) => {
	assert(parent);

	const nodes = parent.nodes;
	const index = nodes.findIndex((node) => node.sourceIndex >= sourceIndex && !isNot(node));
	const node = index === -1 ? nodes[nodes.length - 1] : nodes[index - 1];

	assert(node);

	return node;
};

/**
 * @param {Pseudo} not
 * @param {Rule} ruleNode
 * @param {Root} selectorRoot
 */
function fixSimple(not, ruleNode, selectorRoot) {
	const nonEmptySelectors = not.nodes.filter(({ nodes }) => nodes.length > 0);

	for (const { nodes } of nonEmptySelectors) {
		assert(nodes[0]);
		nodes[0].rawSpaceBefore = '';
		nodes[0].rawSpaceAfter = '';
	}

	// Without a selector, the pseudo-class loses its parentheses
	const [firstSelector = not.nodes[0], ...otherSelectors] = nonEmptySelectors;

	assert(firstSelector);
	assert(not.parent);

	not.empty();
	not.nodes.push(firstSelector);

	for (const selector of otherSelectors) {
		const last = getLastConsecutiveNot(not);
		const clone = last.clone({ nodes: [selector] });

		clone.rawSpaceBefore = '';
		not.parent.insertAfter(last, clone);
	}

	setRuleSelector(ruleNode, selectorRoot.toString());
}

/**
 * @param {Pseudo} previousNot
 * @param {Rule} ruleNode
 * @param {Root} selectorRoot
 */
function fixComplex(previousNot, ruleNode, selectorRoot) {
	const selectors = [...previousNot.nodes];

	for (let node = previousNot.next(); isNot(node); node = previousNot.next()) {
		selectors.push(...node.nodes);
		node.remove();
	}

	const nonEmptySelectors = selectors.filter(({ nodes }) => nodes.length > 0);

	for (const [index, { nodes }] of nonEmptySelectors.entries()) {
		assert(nodes[0]);
		nodes[0].rawSpaceBefore = index === 0 ? '' : ' ';
		nodes[0].rawSpaceAfter = '';
	}

	// Without a selector, the pseudo-class loses its parentheses
	if (nonEmptySelectors.length > 0) previousNot.nodes = nonEmptySelectors;

	setRuleSelector(ruleNode, selectorRoot.toString());
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
