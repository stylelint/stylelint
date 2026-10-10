import valueParser from 'postcss-value-parser';

import isCustomProperty from './isCustomProperty.mjs';
import { isValueWord } from './typeGuards.mjs';

/**
 * The custom property names in the prelude of an `@property` rule
 *
 * @param {import('postcss').AtRule} atRule
 * @returns {string[]}
 */
export default function getCustomPropertyNames(atRule) {
	return valueParser(atRule.params)
		.nodes.filter(isValueWord)
		.map(({ value }) => value)
		.filter(isCustomProperty);
}
