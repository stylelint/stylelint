import { flattenNestedSelector } from '@csstools/selector-resolve-nested';

import getRuleSelector from './getRuleSelector.mjs';
import { isRule } from './typeGuards.mjs';
import selectorAST from './selectorAST.mjs';
import selectorParser from 'postcss-selector-parser';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 * @typedef {import('postcss-selector-parser').Root} SelectorRoot
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}> | undefined}
 */
export default function flattenNestedSelectorsForRule(rule, result) {
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
				ast = flattenNestedSelector(childAST, ast);
			} else {
				ast = childAST;
			}
		}
	}

	return ownAST.map((selector) => {
		const root = selectorParser.root({
			value: '',
		});

		root.append(selector.clone());

		if (!ast) {
			return {
				selector,
				resolvedSelectors: root.nodes,
			};
		}

		return {
			selector,
			resolvedSelectors: flattenNestedSelector(root, ast).nodes,
		};
	});
}
