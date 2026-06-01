import { isComment } from './typeGuards.mjs';
import isSharedLineComment from './isSharedLineComment.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isAfterComment(node) {
	const previousNode = node.prev();

	if (!isComment(previousNode)) {
		return false;
	}

	return !isSharedLineComment(previousNode);
}
