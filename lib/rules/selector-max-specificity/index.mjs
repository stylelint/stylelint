import { compare, selectorSpecificity } from '@csstools/selector-specificity';
import selectorParser from 'postcss-selector-parser';

import { assertNumber, isRegExp, isString } from '../../utils/validateTypes.mjs';

import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-specificity';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) => `Expected "${selector}" to have a specificity no more than "${max}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-specificity',
};

/** @typedef {import('@csstools/selector-specificity').Specificity} Specificity */

/**
 * @param {import('postcss-selector-parser').Selector} selector
 * @param {(selector: string) => boolean} isIgnored
 * @returns {import('postcss-selector-parser').Selector}
 */
function removeIgnoredNodes(selector, isIgnored) {
	selector.walk((node) => {
		let value = '';

		switch (node.type) {
			case 'attribute':
			case 'class':
			case 'id':
			case 'tag':
				value = node.toString();
				break;
			case 'pseudo':
				value = node.value;
				break;

			default:
				return;
		}

		if (!value) {
			return;
		}

		if (isIgnored(value)) {
			node.replaceWith(
				selectorParser.universal({
					value: '*',
					sourceIndex: node.sourceIndex,
					source: node.source,
				}),
			);
		}
	});

	return selector;
}

/** @type {import('stylelint').Rule<string>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [
					// Check that the max specificity is in the form "a,b,c"
					(spec) => isString(spec) && /^\d+,\d+,\d+$/.test(spec),
				],
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

		/** @type {(selector: string) => boolean} */
		const isSelectorIgnored = (selector) => {
			return optionsMatches(secondaryOptions, 'ignoreSelectors', selector);
		};

		const [a, b, c] = primary.split(',').map((s) => Number.parseFloat(s));

		assertNumber(a);
		assertNumber(b);
		assertNumber(c);

		const maxSpecificity = { a, b, c };

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selectorList = resolveNestedSelectorsForRule(ruleNode, result);

			if (!selectorList) return;

			selectorList.forEach(({ selector, resolvedSelectors }) => {
				const selectorStr = selector.toString();

				resolvedSelectors.forEach((resolvedSelector) => {
					resolvedSelector = removeIgnoredNodes(resolvedSelector, isSelectorIgnored);

					if (!isStandardSyntaxSelector(resolvedSelector.toString())) return;

					// Check if the selector specificity exceeds the allowed maximum
					if (compare(selectorSpecificity(resolvedSelector), maxSpecificity) > 0) {
						const index = selector.first?.sourceIndex ?? 0;

						report({
							ruleName,
							result,
							node: ruleNode,
							index,
							endIndex: index + selectorStr.length,
							message: messages.expected,
							messageArgs: [selectorStr.trim(), primary],
						});
					}
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
