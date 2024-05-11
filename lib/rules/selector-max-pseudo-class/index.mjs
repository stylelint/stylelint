import flattenNestedSelectorsForRule from '../../utils/flattenNestedSelectorsForRule.mjs';
import isContextFunctionalPseudoClass from '../../utils/isContextFunctionalPseudoClass.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { levelOneAndTwoPseudoElements } from '../../reference/selectors.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-pseudo-class';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} pseudo-${max === 1 ? 'class' : 'classes'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-pseudo-class',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: isNonNegativeInteger,
		});

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Container<string | undefined>} resolvedSelectorNode
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(resolvedSelectorNode, selectorNode, ruleNode) {
			const count = resolvedSelectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, selectorNode, ruleNode);
				}

				// Exclude pseudo elements from the count
				if (
					childNode.type === 'pseudo' &&
					(childNode.value.includes('::') ||
						levelOneAndTwoPseudoElements.has(childNode.value.toLowerCase().slice(1)))
				) {
					return total;
				}

				if (childNode.type === 'pseudo') {
					total += 1;
				}

				return total;
			}, 0);

			if (count > primary) {
				const index = selectorNode.first?.sourceIndex ?? 0;
				const selectorStr = selectorNode.toString().trim();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selectorStr, primary],
					index,
					endIndex: index + selectorStr.length,
				});
			}
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			flattenNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.forEach((resolvedSelector) => {
					checkSelector(resolvedSelector, selector, ruleNode);
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
