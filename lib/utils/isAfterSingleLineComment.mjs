import { isComment } from './typeGuards.mjs';
import isSharedLineComment from './isSharedLineComment.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isAfterSingleLineComment(node) {
	const prevNode = node.prev();

	// A comment on the same line as `node` is still the comment `node` follows,
	// so it's only shared when it also belongs to a preceding node or a block start.
	return (
		isComment(prevNode) &&
		!isSharedLineComment(prevNode, node) &&
		prevNode.source !== undefined &&
		prevNode.source.start !== undefined &&
		prevNode.source.end !== undefined &&
		prevNode.source.start.line === prevNode.source.end.line
	);
}
