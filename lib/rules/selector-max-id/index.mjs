import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isContextFunctionalPseudoClass from '../../utils/isContextFunctionalPseudoClass.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-id';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} ID ${max === 1 ? 'selector' : 'selectors'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-id',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
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
					ignoreContextFunctionalPseudoClasses: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * Return true if the node is inside an ignored context-functional pseudo-class
		 *
		 * @param {import('postcss-selector-parser').Node} node
		 * @returns {boolean}
		 */
		function isInIgnoredContextFunctionalPseudoClass(node) {
			/** @type {typeof node | typeof node.parent} */
			let current = node;

			while (current) {
				if (
					isContextFunctionalPseudoClass(current) &&
					optionsMatches(secondaryOptions, 'ignoreContextFunctionalPseudoClasses', current.value)
				) {
					return true;
				}

				current = current.parent;
			}

			return false;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selectors = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			selectors?.each((selector) => {
				let count = 0;

				selector.walkIds((selectorNode) => {
					if (isInIgnoredContextFunctionalPseudoClass(selectorNode)) return;

					count += 1;
				});

				if (count > primary) {
					const { index, endIndex, selector: selectorStr } = getStrippedSelectorSource(selector);

					report({
						ruleName,
						result,
						node: ruleNode,
						message: messages.expected,
						messageArgs: [selectorStr, primary],
						index,
						endIndex,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
