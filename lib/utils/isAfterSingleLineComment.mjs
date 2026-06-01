import { isComment } from './typeGuards.mjs';
import isSharedLineComment from './isSharedLineComment.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isAfterSingleLineComment(node) {
	const prevNode = node.prev();

	return (
		isComment(prevNode) &&
		!isSharedLineComment(prevNode) &&
		prevNode.source !== undefined &&
		prevNode.source.start !== undefined &&
		prevNode.source.end !== undefined &&
		prevNode.source.start.line === prevNode.source.end.line
	);
}
