import { isValueFunction } from './typeGuards.mjs';
import { mathFunctions } from '../reference/functions.mjs';

/**
 * Check whether a node is math function
 *
 * @param {import('postcss-value-parser').Node} node postcss-value-parser node
 * @returns {boolean} If `true`, the node is math function
 */
export default function isMathFunction(node) {
	return isValueFunction(node) && mathFunctions.has(node.value.toLowerCase());
}
