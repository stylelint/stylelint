import { parse, walk } from 'css-tree';

import { atRuleRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import { isAtRule, isRule } from '../../utils/typeGuards.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isInDocument from '../../utils/isInDocument.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'nesting-selector-no-missing-scoping-root';

const messages = ruleMessages(ruleName, {
	rejected: 'Missing scoping root',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/nesting-selector-no-missing-scoping-root',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary, possible: [true] },
			{
				actual: secondaryOptions,
				possible: {
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		root.walkRules(mayIncludeRegexes.nestingSelector, (ruleNode) => {
			if (isInDocument(ruleNode)) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

			// Check if the rule is nested within a scoping root
			if (hasValidScopingRoot(ruleNode, secondaryOptions)) return;

			let ast;

			try {
				ast = parse(getRuleSelector(ruleNode), { context: 'selectorList', positions: true });
			} catch {
				// Cannot parse selector list, skip checking
				return;
			}

			check(ruleNode, ast);
		});

		// Check @scope at-rules for nesting selectors in parameters
		root.walkAtRules(atRuleRegexes.scopeName, (atRule) => {
			if (isInDocument(atRule)) return;

			if (!isStandardSyntaxAtRule(atRule)) return;

			if (!mayIncludeRegexes.nestingSelector.test(atRule.params)) return;

			// Only check @scope at-rules that don't have a parent scoping context
			if (hasValidScopingRoot(atRule, secondaryOptions)) return;

			let ast;

			try {
				ast = parse(getAtRuleParams(atRule), {
					atrule: 'scope',
					context: 'atrulePrelude',
					positions: true,
				});
			} catch {
				// Cannot parse @scope at-rule, skip checking
				return;
			}

			check(atRule, ast, atRuleParamIndex(atRule));
		});

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} node
		 * @param {import('css-tree').CssNode} ast
		 * @param {number} [offset=0]
		 */
		function check(node, ast, offset = 0) {
			walk(ast, {
				visit: 'NestingSelector',
				enter(nestingSelector) {
					if (!nestingSelector.loc) return;

					const index = offset + nestingSelector.loc.start.offset;
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
 * @param {object} secondaryOptions
 * @returns {boolean}
 */
function hasValidScopingRoot(node, secondaryOptions) {
	return Boolean(
		findNodeUpToRoot(
			node,
			(current) =>
				isRule(current) ||
				(isAtRule(current) && current.name === 'scope') ||
				(isAtRule(current) && optionsMatches(secondaryOptions, 'ignoreAtRules', current.name)),
		),
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
