import resolveNestedSelector from 'postcss-resolve-nested-selector';
import selectorParser from 'postcss-selector-parser';

import getRuleSelector from './getRuleSelector.mjs';
import isStandardSyntaxSelector from './isStandardSyntaxSelector.mjs';
import parseSelector from './parseSelector.mjs';

/**
 * @typedef {import('postcss-selector-parser').Selector} Selector
 * @typedef {import('postcss-selector-parser').Root} Root
 * @typedef {{selector: Selector, resolvedSelectors: Root, nested: boolean}} FlattenedSelector
 *
 * @param {import('postcss').Rule} rule
 * @param {import('stylelint').PostcssResult} result
 * @returns {Array<FlattenedSelector>}
 */
export default function flattenNestedSelectorsForRule(rule, result) {
	const ownAST = parseSelector(getRuleSelector(rule), result, rule);

	if (!ownAST) return [];

	/** @type {Array<FlattenedSelector>} */
	const flattenedSelectors = [];

	for (const selectorAST of ownAST.nodes) {
		const selector = selectorAST.toString();

		const resolvedSelectors = resolveNestedSelector(selector, rule);

		if (resolvedSelectors.length === 1 && resolvedSelectors[0] === selector) {
			flattenedSelectors.push({
				selector: selectorAST,
				resolvedSelectors: selectorParser.root({
					value: '',
					nodes: [selectorAST],
				}),
				nested: false,
			});

			continue;
		}

		for (const resolvedSelector of resolvedSelectors) {
			if (!isStandardSyntaxSelector(resolvedSelector)) return [];

			const resolvedRoot = parseSelector(resolvedSelector, result, rule);

			if (!resolvedRoot) {
				continue;
			}

			flattenedSelectors.push({
				selector: selectorAST,
				resolvedSelectors: resolvedRoot,
				nested: true,
			});
		}
	}

	return flattenedSelectors;
}
