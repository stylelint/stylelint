import selectorParser from 'postcss-selector-parser';
const { isAttribute, isClassName, isIdentifier, isPseudoClass, isTag, isUniversal } =
	selectorParser;

import { assert } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-not-notation';
const messages = ruleMessages(ruleName, {
	expected: (type) => `Expected ${type} :not() pseudo-class notation`,
});
const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-not-notation',
	fixable: true,
};

/** @typedef {import('postcss-selector-parser').Node} Node */
/** @typedef {import('postcss-selector-parser').Selector} Selector */
/** @typedef {import('postcss-selector-parser').Pseudo} Pseudo */

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
 * @param {Node} node
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

/** @type {import('stylelint').Rule} */
const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['simple', 'complex'],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selector = ruleNode.selector;

			if (!selector.includes(':not(')) return;

			if (!isStandardSyntaxSelector(selector)) return;

			const fixedSelector = parseSelector(selector, result, ruleNode, (container) => {
				container.walkPseudos((pseudo) => {
					if (!isNot(pseudo)) return;

					if (primary === 'complex') {
						const prev = pseudo.prev();
						const hasConsecutiveNot = prev && isNot(prev);

						if (!hasConsecutiveNot) return;

						if (context.fix) return fixComplex(prev);
					} else {
						const selectors = pseudo.nodes;

						if (isSimple(selectors)) return;

						const mustFix =
							context.fix &&
							selectors.length > 1 &&
							selectors[1] &&
							(selectors[1].nodes.length === 0 ||
								selectors.every(({ nodes }) => nodes.length === 1));

						if (mustFix) return fixSimple(pseudo);
					}

					assert(pseudo.source && pseudo.source.end);

					report({
						message: messages.expected,
						messageArgs: [primary],
						node: ruleNode,
						index: pseudo.sourceIndex,
						endIndex: pseudo.source.end.column,
						result,
						ruleName,
					});
				});
			});

			if (context.fix && fixedSelector) {
				ruleNode.selector = fixedSelector;
			}
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
 */
function fixSimple(not) {
	const simpleSelectors = not.nodes
		.filter(({ nodes }) => nodes[0] && isSimpleSelector(nodes[0]))
		.map((s) => {
			assert(s.nodes[0]);
			s.nodes[0].rawSpaceBefore = '';
			s.nodes[0].rawSpaceAfter = '';

			return s;
		});
	const firstSelector = simpleSelectors.shift();

	assert(firstSelector);
	assert(not.parent);

	not.empty();
	not.nodes.push(firstSelector);

	for (const s of simpleSelectors) {
		const last = getLastConsecutiveNot(not);

		not.parent.insertAfter(last, last.clone({ nodes: [s] }));
	}
}

/**
 * @param {Pseudo} previousNot
 */
function fixComplex(previousNot) {
	const indentAndTrimRight = (/** @type {Selector[]} */ selectors) => {
		for (const s of selectors) {
			assert(s.nodes[0]);
			s.nodes[0].rawSpaceBefore = ' ';
			s.nodes[0].rawSpaceAfter = '';
		}
	};
	const [head, ...tail] = previousNot.nodes;
	let node = previousNot.next();

	if (head == null || head.nodes.length === 0) return;

	assert(head.nodes[0]);
	head.nodes[0].rawSpaceBefore = '';
	head.nodes[0].rawSpaceAfter = '';
	indentAndTrimRight(tail);

	while (isNot(node)) {
		const selectors = node.nodes;
		const prev = node;

		indentAndTrimRight(selectors);
		previousNot.nodes = previousNot.nodes.concat(selectors);
		node = node.next();
		prev.remove();
	}
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
