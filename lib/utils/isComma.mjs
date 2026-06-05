import { isValueDiv } from './typeGuards.mjs';

/**
 * Whether a node is a comma divider.
 *
 * @param {import('postcss-value-parser').Node | null | undefined} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
export default function isComma(node) {
	return isValueDiv(node) && node.value === ',';
}
