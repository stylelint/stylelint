import { isComment } from './typeGuards.mjs';

/** @import { Node } from 'postcss' */

/**
 * @param {Node | void} node
 */
function getNodeLine(node) {
	return node && node.source && node.source.start && node.source.start.line;
}

/**
 * @param {Node | void} node
 * @returns {Node | void}
 */
export default function getNextNonSharedLineCommentNode(node) {
	if (node === undefined) {
		return undefined;
	}

	/** @type {Node | undefined} */
	const nextNode = node.next();

	if (!isComment(nextNode)) {
		return nextNode;
	}

	if (
		getNodeLine(node) === getNodeLine(nextNode) ||
		getNodeLine(nextNode) === getNodeLine(nextNode.next())
	) {
		return getNextNonSharedLineCommentNode(nextNode);
	}

	return nextNode;
}
