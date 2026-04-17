import { isAtRule, isRule } from './typeGuards.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isAfterBlock(node) {
	const previousNode = node.prev();

	if (!previousNode) {
		return false;
	}

	return isRule(previousNode) || isAtRule(previousNode);
}
