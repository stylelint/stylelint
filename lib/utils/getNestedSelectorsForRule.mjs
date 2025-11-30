import flattenNestedSelectorsForRule from './flattenNestedSelectorsForRule.mjs';
import resolveNestedSelectorsForRule from './resolveNestedSelectorsForRule.mjs';

/** @import { Selector, Root } from 'postcss-selector-parser' */
/** @import { Rule } from 'postcss' */
/** @import { PostcssResult } from 'stylelint' */

/**
 * @typedef {{selector: Selector, resolvedSelectors: Root, nested: boolean}} ResolvedSelector
 *
 * @param {Rule} rule
 * @param {PostcssResult} result
 * @returns {Array<ResolvedSelector>}
 */
export default function getNestedSelectorsForRule(rule, result) {
	if (result.stylelint.config?.languageOptions?.nestingMode === 'native') {
		return resolveNestedSelectorsForRule(rule, result);
	}

	return flattenNestedSelectorsForRule(rule, result);
}
