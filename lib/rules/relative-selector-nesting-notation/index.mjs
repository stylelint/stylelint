import selectorParser from 'postcss-selector-parser';

import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'relative-selector-nesting-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected ${primary} nesting notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/relative-selector-nesting-notation',
	fixable: true,
};

const { isCombinator, isComment, isNesting, isSelector, nesting } = selectorParser;

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['explicit', 'implicit'],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (!isNestedStyleRule(ruleNode)) return;

			const selectorRoot = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			if (!selectorRoot) return;

			selectorRoot.each((selector) => {
				if (!isSelector(selector)) return;

				const selectorStartsWithCombinator = startsWithCombinator(selector);

				let fix;

				if (primary === 'explicit') {
					if (containsNestingSelector(selector) && !selectorStartsWithCombinator) return;

					fix = () => fixExplicit(selector, ruleNode, selectorRoot);
				} else {
					if (selectorStartsWithCombinator || !canUseImplicitNesting(selector)) return;

					fix = () => fixImplicit(selector, ruleNode, selectorRoot);
				}

				const index = selector.sourceIndex;
				const endIndex = index + selector.toString().trim().length;

				report({
					message: messages.expected,
					messageArgs: [primary],
					node: ruleNode,
					index,
					endIndex,
					ruleName,
					result,
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
 * Check if a rule is a nested style rule
 *
 * @param {import('postcss').Rule} ruleNode
 * @returns {boolean}
 */
function isNestedStyleRule(ruleNode) {
	return Boolean(findNodeUpToRoot(ruleNode, ({ type }) => type === 'rule'));
}

/**
 * Check if a selector contains the nesting selector
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @returns {boolean}
 */
function containsNestingSelector(selector) {
	let hasNestingSelector = false;

	selector.walkNesting(() => {
		hasNestingSelector = true;

		return false;
	});

	return hasNestingSelector;
}

/**
 * Check if a selector starts with a combinator
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @returns {boolean}
 */
function startsWithCombinator(selector) {
	const firstSignificantNode = selector.nodes.find((node) => !isComment(node));

	return isCombinator(firstSignificantNode);
}

/**
 * Check if a selector can use implicit nesting, i.e.
 * has a combinator after any comments or nesting selectors
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @returns {boolean}
 */
function canUseImplicitNesting(selector) {
	const foundNode = selector.nodes.find((node) => !isComment(node) && !isNesting(node));

	return isCombinator(foundNode);
}

/**
 * Fix selector to use explicit nesting notation
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @param {import('postcss').Rule} ruleNode
 * @param {import('postcss-selector-parser').Root} selectorRoot
 */
function fixExplicit(selector, ruleNode, selectorRoot) {
	const firstSignificantNode = selector.nodes.find((node) => !isComment(node));

	if (firstSignificantNode) {
		const { before } = firstSignificantNode.spaces;

		selector.insertBefore(
			firstSignificantNode,
			nesting({
				spaces: {
					after: ' ',
					before,
				},
			}),
		);
		firstSignificantNode.spaces.before = '';
	}

	ruleNode.selector = selectorRoot.toString();
}

/**
 * Fix selector to use implicit nesting notation
 *
 * @param {import('postcss-selector-parser').Selector} selector
 * @param {import('postcss').Rule} ruleNode
 * @param {import('postcss-selector-parser').Root} selectorRoot
 */
function fixImplicit(selector, ruleNode, selectorRoot) {
	const firstNestingNode = selector.nodes.find(isNesting);
	let spaceBeforeFirstNestingNode = '';

	// Remove the first nesting node and store its spaces.before
	if (firstNestingNode) {
		spaceBeforeFirstNestingNode = firstNestingNode.spaces.before;
		firstNestingNode.remove();
	}

	const firstCombinatorNode = selector.nodes.find(isCombinator);

	// Remove the first combinator node and update the next node's spaces
	if (firstCombinatorNode) {
		const nextNode = firstCombinatorNode.next();

		if (nextNode) {
			nextNode.spaces.before = spaceBeforeFirstNestingNode;
		}

		// If it's a descendant combinator remove it, otherwise clear its before space
		if (firstCombinatorNode.value === ' ') {
			firstCombinatorNode.remove();
		} else {
			firstCombinatorNode.spaces.before = '';
		}
	}

	ruleNode.selector = selectorRoot.toString();
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
