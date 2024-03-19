import resolveNestedSelector from 'postcss-resolve-nested-selector';

import getRuleSelector from './getRuleSelector.mjs';
import getSelectorAST from './getSelectorAST.mjs';
import isStandardSyntaxSelector from './isStandardSyntaxSelector.mjs';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 *
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}>}
 */
export default function flattenNestedSelectorsForRule(rule, result) {
	const ownAST = getSelectorAST(getRuleSelector(rule), result, rule);

	if (!ownAST) return [];

	const flattenedSelectors = [];

	for (const selectorAST of ownAST.nodes) {
		const resolvedSelectors = resolveNestedSelector(selectorAST.toString(), rule);

		for (const resolvedSelector of resolvedSelectors) {
			if (!isStandardSyntaxSelector(resolvedSelector)) return [];

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
