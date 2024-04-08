import flattenNestedSelectorsForRule from '../../utils/flattenNestedSelectorsForRule.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import { isString } from '../../utils/validateTypes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-universal';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} universal ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-universal',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isNonNegativeInteger,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreAfterCombinators: [isString],
				},
				optional: true,
			},
		);

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
				// Only traverse inside actual selectors
				// All logical combinations will be resolved as nested selector in `postcss-resolve-nested-selector`
				if (childNode.type === 'selector') {
					checkSelector(childNode, selectorNode, ruleNode);
				}

				const prevChildNode = childNode.prev();
				const prevChildNodeValue = prevChildNode && prevChildNode.value;

				if (childNode.type === 'universal') {
					if (!optionsMatches(secondaryOptions, 'ignoreAfterCombinators', prevChildNodeValue)) {
						total += 1;
					}
				}

				return total;
			}, 0);

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && count > primary) {
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

			if (!isStandardSyntaxSelector(ruleNode.selector)) return;

			flattenNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.forEach((resolvedSelector) => {
					checkSelector(resolvedSelector, selector, ruleNode);

					resolvedSelector.walk((childSelector) => {
						if (childSelector.type !== 'selector') return;

						checkSelector(childSelector, selector, ruleNode);
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
