import resolveNestedSelector from 'postcss-resolve-nested-selector';

import getRuleSelector from './getRuleSelector.mjs';
import isStandardSyntaxSelector from './isStandardSyntaxSelector.mjs';
import parseSelector from './parseSelector.mjs';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 *
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<{selector: Selector, resolvedSelectors: Array<Selector>}>}
 */
export default function flattenNestedSelectorsForRule(rule, result) {
	const ownAST = parseSelector(getRuleSelector(rule), result, rule);

	if (!ownAST) return [];

	const flattenedSelectors = [];

	for (const selectorAST of ownAST.nodes) {
		const resolvedSelectors = resolveNestedSelector(selectorAST.toString(), rule);

		for (const resolvedSelector of resolvedSelectors) {
			if (!isStandardSyntaxSelector(resolvedSelector)) return [];

			const resolvedRoot = parseSelector(resolvedSelector, result, rule);

			if (!resolvedRoot) {
				continue;
			}

			flattenedSelectors.push({
				selector: selectorAST,
				resolvedSelectors: resolvedRoot.nodes,
			});
		}
	}

	return flattenedSelectors;
}
