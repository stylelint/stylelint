import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'block-no-redundant-nesting';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected redundant nesting selector',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/block-no-redundant-nesting',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = getRuleSelector(ruleNode);

			// Check if this is a redundant nesting selector (just "&")
			if (isRedundantNestingSelector(selector, result, ruleNode)) {
				report({
					message: messages.rejected,
					node: ruleNode,
					result,
					ruleName,
				});
			}
		});
	};
};

/**
 * Check if a selector is a redundant nesting selector
 * @param {string} selector
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Rule} ruleNode
 * @returns {boolean}
 */
function isRedundantNestingSelector(selector, result, ruleNode) {
	const selectorRoot = parseSelector(selector, result, ruleNode);

	if (!selectorRoot) return false;

	return selectorRoot.every((selectorNode) => {
		// A redundant nesting selector is one that contains only a nesting selector (&)
		// with no additional qualifiers, descendants, or pseudo-elements
		const { nodes } = selectorNode;

		// Should have exactly one node which is a nesting selector
		if (nodes.length !== 1) return false;

		const firstNode = nodes[0];

		// Check if it's a nesting selector (&)
		return Boolean(firstNode && firstNode.type === 'nesting' && firstNode.value === '&');
	});
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
