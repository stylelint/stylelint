import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
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
				const endIndex = index + 1;

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

		// Check @scope at-rules for nesting selectors in parameters
		root.walkAtRules(atRuleRegexes.scopeName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			// Only reject orphaned @scope at top level (without parent rules)
			if (hasValidScopingRoot(atRule)) return;

			const params = getAtRuleParams(atRule);

			if (!params) return;

			checkScopeParams(params, atRule, result);
		});
	};
};

/**
 * Check if a node has a valid scoping root
 * @param {import('postcss').Rule | import('postcss').AtRule} node
 * @returns {boolean}
 */
function hasValidScopingRoot(node) {
	let current = node.parent;

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

/**
 * Check @scope at-rule parameters for nesting selectors
 * @param {string} params
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 */
function checkScopeParams(params, atRule, result) {
	const parenthesesRegex = /\(([^)]+)\)/g;
	let match;

	while ((match = parenthesesRegex.exec(params)) !== null) {
		const selectorText = match[1]?.trim();

		if (selectorText) {
			const selectorStart = match.index + 1; // Position inside parentheses

			// Check if this selector is in a "to" clause by looking for "to" before this match
			const isInToClause = params.substring(0, match.index).includes(' to ');

			checkSelectorText(selectorText, atRule, result, selectorStart, isInToClause);
		}
	}
}

/**
 * Parse and check a selector text for nesting selectors using postcss-selector-parser
 * @param {string} selectorText
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 * @param {number} selectorStart
 * @param {boolean} isInToClause
 */
function checkSelectorText(selectorText, atRule, result, selectorStart, isInToClause) {
	if (!selectorText) return;

	// Use the same parseSelector approach as the main rule for consistency
	parseSelector(selectorText, result, atRule)?.walkNesting((nestingNode) => {
		const { sourceIndex: nestingOffset } = nestingNode;
		const baseIndex = atRuleParamIndex(atRule);
		// Apply -1 correction only for selectors in "to" clause to account for parsing differences
		const positionCorrection = isInToClause ? -1 : 0;
		const index = baseIndex + selectorStart + nestingOffset + positionCorrection;
		const endIndex = index + 1;

		report({
			message: messages.rejected,
			node: atRule,
			result,
			ruleName,
			index,
			endIndex,
		});
	});
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
