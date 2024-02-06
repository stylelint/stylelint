import resolvedNestedSelector from 'postcss-resolve-nested-selector';

import getRuleSelector from './getRuleSelector.mjs';
import getSelectorAST from './getSelectorAST.mjs';
import isStandardSyntaxSelector from './isStandardSyntaxSelector.mjs';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 * @typedef {import('postcss-selector-parser').Root} SelectorRoot
 * @typedef {Array<{selector: Selector, resolvedSelectors: Array<Selector>}> | undefined} FlattenedSelectors
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}> | undefined}
 */
export default function flattenNestedSelectorsForRule(rule, result) {
	/** @type {FlattenedSelectors} */
	const flattenedSelectors = [];

	const ownAST = getSelectorAST(getRuleSelector(rule), result, rule);

	if (!ownAST) return;

	for (const selectorAST of ownAST.nodes) {
		const resolvedSelectors = resolvedNestedSelector(selectorAST.toString(), rule);

		for (const resolvedSelector of resolvedSelectors) {
			if (!isStandardSyntaxSelector(resolvedSelector)) return;

			const resolvedRoot = getSelectorAST(resolvedSelector, result, rule);

			if (!resolvedRoot) {
				continue;
			}

			flattenedSelectors.push({
				selector: selectorAST.clone(),
				resolvedSelectors: resolvedRoot.nodes,
			});
		}
	}

	return flattenedSelectors;
}
