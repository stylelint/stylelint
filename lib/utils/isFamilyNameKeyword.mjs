import { fontFamilyKeywords } from '../reference/keywords.mjs';

/**
 * Whether a node is an unquoted generic font-family keyword.
 *
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
export default function isFamilyNameKeyword(node) {
	return !isValueString(node) && fontFamilyKeywords.has(node.value.toLowerCase());
}
