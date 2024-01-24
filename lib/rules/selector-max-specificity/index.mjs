import { compare, selectorSpecificity } from '@csstools/selector-specificity';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import selectorParser from 'postcss-selector-parser';

import { assertNumber, isRegExp, isString } from '../../utils/validateTypes.mjs';
import { isAtRule, isRule } from '../../utils/typeGuards.mjs';

import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import selectorAST from '../../utils/selectorAST.mjs';
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

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 * @typedef {import('postcss-selector-parser').Root} SelectorRoot
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @param {(selector: string) => boolean} isIgnored
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}> | undefined}
 */
function gatherSelectorsForRule(rule, result, isIgnored) {
	/** @typedef {import('postcss').Document} Document */
	/** @typedef {import('postcss').Root} Root */
	/** @typedef {import('postcss').Container} Container */

	const ownAST = selectorAST(getRuleSelector(rule), result, rule);

	if (!ownAST) return;

	/** @type {import('postcss-selector-parser').Root | undefined} */
	let ast = undefined;

	/** @type {Array<Document|Root|Container>} */
	let ancestors = [];

	{
		/** @type {Document|Root|Container|undefined} */
		let parent = rule.parent;

		while (parent) {
			ancestors.push(parent);
			parent = parent.parent;
		}
	}

	ancestors.reverse();

	for (const child of ancestors) {
		if (isRule(child)) {
			const childAST = selectorAST(getRuleSelector(child), result, child);

			if (!childAST) return;

			if (ast) {
				ast = resolveNestedSelector(childAST, ast);
			} else {
				ast = childAST;
			}

			continue;
		}

		if (isAtRule(child) && ast) {
			// `.foo, #bar { @media screen { color: red; } }`
			// equivalent to
			// `@media screen { .foo, #bar { & { color: red; } } }`
			// `@media screen { :is(.foo, #bar) { color: red; } }`
			const childAST = selectorAST('&', result, child);

			if (!childAST) return;

			ast = resolveNestedSelector(childAST, ast);
		}
	}

	return ownAST.map((selector) => {
		if (!ast) {
			return {
				selector,
				resolvedSelectors: [removeIgnoredNodes(selector.clone(), isIgnored)],
			};
		}

		return {
			selector,
			resolvedSelectors: resolveNestedSelector(
				selectorParser.root({
					nodes: [selector],
					value: '',
				}),
				ast,
			).nodes.map((x) => removeIgnoredNodes(x, isIgnored)),
		};
	});
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

			const selectorList = gatherSelectorsForRule(ruleNode, result, isSelectorIgnored);

			if (!selectorList) return;

			selectorList.forEach(({ selector, resolvedSelectors }) => {
				const selectorStr = selector.toString();

				resolvedSelectors.forEach((resolvedSelector) => {
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
