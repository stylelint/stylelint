// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTree = require('css-tree');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const regexes = require('../../utils/regexes.cjs');
const getAtRuleParams = require('../../utils/getAtRuleParams.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

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

			// Check if the rule is nested within a scoping root
			if (hasValidScopingRoot(ruleNode)) return;

			let ast;

			try {
				ast = cssTree.parse(getRuleSelector(ruleNode), { context: 'selectorList', positions: true });
			} catch {
				// Cannot parse selector list, skip checking
				return;
			}

			check(ruleNode, ast);
		});

		// Check @scope at-rules for nesting selectors in parameters
		root.walkAtRules(regexes.atRuleRegexes.scopeName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			// Cheap check for nesting selector
			if (!atRule.params.includes('&')) return;

			// Only check @scope at-rules that don't have a parent scoping context
			if (hasValidScopingRoot(atRule)) return;

			let ast;

			try {
				ast = cssTree.parse(getAtRuleParams(atRule), {
					atrule: 'scope',
					context: 'atrulePrelude',
					positions: true,
				});
			} catch {
				// Cannot parse @scope at-rule, skip checking
				return;
			}

			check(atRule, ast, nodeFieldIndices.atRuleParamIndex(atRule));
		});

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} node
		 * @param {import('css-tree').CssNode} ast
		 * @param {number} [offset=0]
		 */
		function check(node, ast, offset = 0) {
			cssTree.walk(ast, {
				/**
				 * @param {import('css-tree').CssNode} cssNode
				 */
				enter(cssNode) {
					if (cssNode.type !== 'NestingSelector') return;

					if (!cssNode.loc) return;

					const index = offset + cssNode.loc.start.offset;
					const endIndex = index + 1;

					report({
						message: messages.rejected,
						node,
						result,
						ruleName,
						index,
						endIndex,
					});
				},
			});
		}
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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
