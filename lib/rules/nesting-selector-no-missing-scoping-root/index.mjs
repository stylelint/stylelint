import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'nesting-selector-no-missing-scoping-root';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected missing scoping root',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/nesting-selector-no-missing-scoping-root',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkRules(/&/, (ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			parseSelector(selector, result, ruleNode)?.walkNesting((nestingNode) => {
				// Check if the rule is nested within a scoping root
				if (hasValidScopingRoot(ruleNode)) return;

				const { sourceIndex: index } = nestingNode;
				const nestingSelector = nestingNode.toString().trim();
				const endIndex = index + nestingSelector.length;

				report({
					message: messages.rejected,
					node: ruleNode,
					result,
					ruleName,
					index,
					endIndex,
				});
			});
		});
	};
};

/**
 * Check if a rule has a valid scoping root
 * @param {import('postcss').Rule} ruleNode
 * @returns {boolean}
 */
function hasValidScopingRoot(ruleNode) {
	let current = ruleNode.parent;

	while (current) {
		// If we find a rule in the parent chain, it provides a scoping root
		if (current.type === 'rule') {
			return true;
		}

		// If we find an @scope at-rule, it provides a scoping root
		if (current.type === 'atrule' && current.name === 'scope') {
			return true;
		}

		// If we reach the root without finding a scoping root
		if (current.type === 'root') {
			return false;
		}

		current = current.parent;
	}

	return false;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
