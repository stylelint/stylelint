import { atRuleParamIndex, declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import { atRuleRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import {
	isFunctionNode,
	parseListOfComponentValues,
	sourceIndices,
	walk,
} from '@csstools/css-parser-algorithms';

import { fontFeatureValueTypes } from '../../reference/atKeywords.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import { isAtRule } from '../../utils/typeGuards.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import { tokenize } from '@csstools/css-tokenizer';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-invalid-position-var-function';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected invalid position var() function',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-invalid-position-var-function',
};

const descriptorAtRules = new Set([
	'counter-style',
	'font-face',
	'font-palette-values',
	'property',
	'view-transition',
]);
const pageDescriptors = new Set(['page-orientation', 'size']);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary, possible: [true] });

		if (!validOptions) return;

		/**
		 * @param {import('postcss').Node} node
		 * @param {string} text
		 * @param {number} offset
		 */
		function check(node, text, offset) {
			if (!mayIncludeRegexes.varFunction.test(text)) return;

			walk(parseListOfComponentValues(tokenize({ css: text })), ({ node: component }) => {
				if (!isFunctionNode(component) || component.getName().toLowerCase() !== 'var') return;

				const [start, end] = sourceIndices(component);

				report({
					message: messages.rejected,
					node,
					index: offset + start,
					endIndex: offset + end + 1,
					ruleName,
					result,
				});
			});
		}

		root.walkRules((ruleNode) => {
			const selector = getRuleSelector(ruleNode);

			// A standalone var() selector also resembles a Less mixin to the syntax guard.
			if (!isStandardSyntaxRule(ruleNode) && !/(?:^|[\s>+~,])var\(/i.test(selector)) {
				return;
			}

			check(ruleNode, selector, 0);
		});

		root.walkAtRules(atRuleRegexes.mediaName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const params = getAtRuleParams(atRule);

			if (!isStandardSyntaxValue(params)) return;

			check(atRule, params, atRuleParamIndex(atRule));
		});

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			check(decl, decl.prop, 0);

			const parent = decl.parent;

			if (!isAtRule(parent) || !isStandardSyntaxAtRule(parent)) return;

			const atRuleName = parent.name.toLowerCase();
			const isDescriptor =
				descriptorAtRules.has(atRuleName) ||
				(atRuleName === 'page' && pageDescriptors.has(decl.prop.toLowerCase())) ||
				(fontFeatureValueTypes.has(atRuleName) &&
					isAtRule(parent.parent) &&
					parent.parent.name.toLowerCase() === 'font-feature-values');

			if (!isDescriptor) return;

			const value = getDeclarationValue(decl);

			if (!isStandardSyntaxValue(value)) return;

			check(decl, value, declarationValueIndex(decl));
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
