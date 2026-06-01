import isValidHex from './isValidHex.mjs';
import { isValueWord } from './typeGuards.mjs';

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
export default function isHexColor(node) {
	return isValueWord(node) && isValidHex(node.value);
}
