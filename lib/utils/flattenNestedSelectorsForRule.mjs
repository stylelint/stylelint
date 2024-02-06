import { flattenNestedSelector } from '@csstools/selector-resolve-nested';

import getRuleSelector from './getRuleSelector.mjs';
import getSelectorAST from './getSelectorAST.mjs';
import { isRule } from './typeGuards.mjs';
import isStandardSyntaxSelector from './isStandardSyntaxSelector.mjs';
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

	const ownAST = getSelectorAST(getRuleSelector(rule), result, rule);

	if (!ownAST) return;

	/** @type {Array<Document|Root|Container>} */
	let ancestors = [];
	/** @type {Document|Root|Container|undefined} */
	let parent = rule.parent;

	while (parent && parent.type !== 'root' && parent.type !== 'document') {
		ancestors.push(parent);
		parent = parent.parent;
	}

	ancestors.reverse();

	/** @type {import('postcss-selector-parser').Root | undefined} */
	let ast = undefined;

	for (const child of ancestors) {
		if (!isRule(child)) continue;

		if (!isStandardSyntaxSelector(child.selector)) return;

		const childAST = getSelectorAST(getRuleSelector(child), result, child);

		if (!childAST) return;

		if (ast) {
			ast = flattenNestedSelector(childAST, ast);
		} else {
			ast = childAST;
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
