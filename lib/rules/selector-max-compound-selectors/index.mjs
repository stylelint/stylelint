import resolvedNestedSelector from 'postcss-resolve-nested-selector';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isContextFunctionalPseudoClass from '../../utils/isContextFunctionalPseudoClass.mjs';
import isNonNegativeInteger from '../../utils/isNonNegativeInteger.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-compound-selectors';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} compound ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-compound-selectors',
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
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Node} selectorNode
		 * @returns {boolean}
		 */
		function isSelectorIgnored(selectorNode) {
			const selectorString = selectorNode.toString();
			const selectorStringWithoutParentheses = selectorString.replace(/\(.*\)$/, '');

			return (
				optionsMatches(secondaryOptions, 'ignoreSelectors', selectorString) ||
				optionsMatches(secondaryOptions, 'ignoreSelectors', selectorStringWithoutParentheses)
			);
		}

		/**
		 * Finds actual selectors in selectorNode object and checks them.
		 *
		 * @param {import('postcss-selector-parser').Container<string | undefined>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			let compoundCount = 1;
			let previousNodeWasCompoundSeparator = true; // first node is implicitly preceded by a separator

			selectorNode.each((childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, ruleNode);
				}

				// Compound selectors are separated by combinators, so increase count when meeting one
				if (childNode.type === 'combinator') {
					compoundCount++;
				} else if (isSelectorIgnored(childNode)) {
					compoundCount -= previousNodeWasCompoundSeparator ? 1 : 0;
				}

				previousNodeWasCompoundSeparator = childNode.type === 'combinator';
			});

			if (
				selectorNode.type !== 'root' &&
				selectorNode.type !== 'pseudo' &&
				compoundCount > primary
			) {
				const selector = selectorNode.toString();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected,
					messageArgs: [selector, primary],
					word: selector,
				});
			}
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Using `.selectors` gets us each selector if there is a comma separated set
			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					// Process each resolved selector with `checkSelector` via postcss-selector-parser
					parseSelector(resolvedSelector, result, ruleNode, (s) => checkSelector(s, ruleNode));
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
