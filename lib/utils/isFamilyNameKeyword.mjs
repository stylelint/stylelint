import { fontFamilyKeywords } from '../reference/keywords.mjs';
import { isValueString } from './typeGuards.mjs';

/**
 * Whether a node is an unquoted generic font-family keyword.
 *
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is Exclude<import('postcss-value-parser').Node, import('postcss-value-parser').StringNode>}
 */
export default function isFamilyNameKeyword(node) {
	return !isValueString(node) && fontFamilyKeywords.has(node.value.toLowerCase());
}
