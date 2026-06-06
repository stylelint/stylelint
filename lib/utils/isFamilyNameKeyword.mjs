import { fontFamilyKeywords } from '../reference/keywords.mjs';
import { isValueWord } from './typeGuards.mjs';

/** @import { Maybe } from 'stylelint' */

/**
 * Whether a node is an unquoted generic font-family keyword.
 *
 * @param {Maybe<import('postcss-value-parser').Node>} node
 * @returns {node is import('postcss-value-parser').WordNode}
 */
export default function isFamilyNameKeyword(node) {
	return isValueWord(node) && fontFamilyKeywords.has(node.value.toLowerCase());
}
