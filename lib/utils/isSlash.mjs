import { isValueDiv } from './typeGuards.mjs';

/** @import { Maybe } from 'stylelint' */

/**
 * Whether a node is a slash divider.
 *
 * @param {Maybe<import('postcss-value-parser').Node>} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
export default function isSlash(node) {
	return isValueDiv(node) && node.value === '/';
}
