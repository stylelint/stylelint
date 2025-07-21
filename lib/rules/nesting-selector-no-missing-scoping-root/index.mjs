import { parse } from 'css-tree';

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

/** @typedef {import('css-tree').CssNode} CssNode */
/** @typedef {CssNode & { children: import('css-tree').List<CssNode> }} CssNodeWithChildren */
/** @typedef {CssNode & { root?: CssNodeWithChildren; limit?: CssNodeWithChildren }} ScopeNode */

/**
 * @param {CssNode} node
 * @returns {node is ScopeNode}
 */
function isScopeNode(node) {
	return ('root' in node || 'limit' in node) && 'type' in node;
}

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

			// Check if the rule is nested within a scoping root
			if (hasValidScopingRoot(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			parseSelector(selector, result, ruleNode)?.walkNesting((nestingNode) => {
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

			// Only check @scope at-rules that don't have a parent scoping context
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
 * @param {string} params
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 */
function checkScopeParams(params, atRule, result) {
	// Temporary @scope at-rule to leverage CSSTree's built-in @scope parsing
	let cssTreeAtRule;

	try {
		cssTreeAtRule = parse(`@scope ${params} {}`, { context: 'atrule', positions: true });
	} catch {
		// Cannot parse @scope at-rule, skip checking
		return;
	}

	if (
		cssTreeAtRule.type !== 'Atrule' ||
		cssTreeAtRule.name !== 'scope' ||
		cssTreeAtRule.prelude?.type !== 'AtrulePrelude' ||
		!cssTreeAtRule.prelude.children
	) {
		return;
	}

	const baseIndex = atRuleParamIndex(atRule);

	cssTreeAtRule.prelude.children.forEach((child) => {
		if (isScopeNode(child)) {
			checkScope(child, atRule, result, baseIndex);
		}
	});
}

/**
 * @param {ScopeNode} scopeNode
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 * @param {number} baseIndex
 */
function checkScope(scopeNode, atRule, result, baseIndex) {
	// Check root selector (before "to") for nesting selectors
	if (scopeNode.root) {
		walkSelectorList(scopeNode.root, atRule, result, baseIndex, false);
	}

	// Check limit selector (after "to") for nesting selectors
	if (scopeNode.limit) {
		walkSelectorList(scopeNode.limit, atRule, result, baseIndex, true);
	}
}

/**
 * @param {CssNodeWithChildren} selectorList
 * @param {import('postcss').AtRule} atRule
 * @param {import('stylelint').PostcssResult} result
 * @param {number} baseIndex
 * @param {boolean} isLimitSelector
 */
function walkSelectorList(selectorList, atRule, result, baseIndex, isLimitSelector) {
	if (!selectorList?.children) return;

	selectorList.children.forEach((selector) => {
		if (selector.type !== 'Selector' || !selector.children) return;

		selector.children.forEach((/** @type {CssNode} */ selectorChild) => {
			if (selectorChild.type !== 'NestingSelector' || !selectorChild.loc) return;

			// Adjust position from temporary "@scope " prefix parsing
			// Root selectors: subtract 7 chars ("@scope ")
			// Limit selectors: subtract 8 chars (includes position correction)
			const offset = isLimitSelector ? 8 : 7;
			const index = baseIndex + selectorChild.loc.start.offset - offset;
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
	});
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
