import { compare, selectorSpecificity } from '@csstools/selector-specificity';
import resolvedNestedSelector from 'postcss-resolve-nested-selector';

import { assertNumber, isRegExp, isString } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
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
 * Return a zero specificity. We need a new instance each time so that it can mutated.
 *
 * @returns {Specificity}
 */
const zeroSpecificity = () => ({ a: 0, b: 0, c: 0 });

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
		const isSelectorIgnored = (selector) =>
			optionsMatches(secondaryOptions, 'ignoreSelectors', selector);

		/** @type {(node: import('postcss-selector-parser').Node) => Specificity | void} */
		const isSelectorNodeIgnored = (node) => {
			switch (node.type) {
				case 'attribute':
				case 'class':
				case 'id':
				case 'tag':
					if (!isSelectorIgnored(node.toString())) {
						return;
					}

					return zeroSpecificity();
				case 'pseudo': {
					if (!isSelectorIgnored(node.value.toLowerCase())) {
						return;
					}

					if (!node.nodes) {
						return zeroSpecificity();
					}

					const entireSpecificity = selectorSpecificity(node);

					node.nodes = [];
					const emptySpecificity = selectorSpecificity(node);

					return {
						a: entireSpecificity.a - emptySpecificity.a,
						b: entireSpecificity.b - emptySpecificity.b,
						c: entireSpecificity.c - emptySpecificity.c,
					};
				}
			}
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

			// Using `.selectors` gets us each selector in the eventuality we have a comma separated set
			for (const selector of ruleNode.selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					// Skip non-standard syntax selectors
					if (!isStandardSyntaxSelector(resolvedSelector)) {
						continue;
					}

					const selectorTree = parseSelector(resolvedSelector, result, ruleNode);

					if (!selectorTree) continue;

					// Check if the selector specificity exceeds the allowed maximum
					if (
						compare(
							selectorSpecificity(selectorTree, {
								customSpecificity: isSelectorNodeIgnored,
							}),
							maxSpecificity,
						) > 0
					) {
						report({
							ruleName,
							result,
							node: ruleNode,
							message: messages.expected,
							messageArgs: [resolvedSelector, primary],
							word: selector,
						});
					}
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
