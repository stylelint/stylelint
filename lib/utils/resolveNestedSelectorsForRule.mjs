import { resolveNestedSelector } from '@csstools/selector-resolve-nested';

import getRuleSelector from './getRuleSelector.mjs';
import { isRule } from './typeGuards.mjs';
import isStandardSyntaxRule from './isStandardSyntaxRule.mjs';
import parseSelector from './parseSelector.mjs';
import selectorParser from 'postcss-selector-parser';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 *
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}>}
 */
export default function resolveNestedSelectorsForRule(rule, result) {
	/** @typedef {import('postcss').Document} Document */
	/** @typedef {import('postcss').Root} Root */
	/** @typedef {import('postcss').Container} Container */

	const ownAST = parseSelector(getRuleSelector(rule), result, rule);

	if (!ownAST) return [];

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
		if (!isRule(child)) continue;

		if (!isStandardSyntaxRule(child)) return [];

		const childAST = parseSelector(getRuleSelector(child), result, child);

		if (!childAST) return [];

		if (ast) {
			ast = resolveNestedSelector(childAST, ast);
		} else {
			ast = childAST;
		}
	}

	return ownAST.map((selector) => {
		if (!ast) {
			return {
				selector,
				resolvedSelectors: [selector],
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
			).nodes,
		};
	});
}
