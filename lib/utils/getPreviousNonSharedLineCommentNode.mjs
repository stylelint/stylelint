import { isComment } from './typeGuards.mjs';

/** @import { Node } from 'postcss' */

/**
 * @param {Node} node
 */
function getNodeLine(node) {
	return node.source && node.source.start && node.source.start.line;
}

/**
 * @param {Node | undefined} node
 * @returns {Node | undefined}
 */
export default function getPreviousNonSharedLineCommentNode(node) {
	if (node === undefined) {
		return undefined;
	}

	const previousNode = node.prev();

	if (!isComment(previousNode)) {
		return previousNode;
	}

	if (getNodeLine(node) === getNodeLine(previousNode)) {
		return getPreviousNonSharedLineCommentNode(previousNode);
	}

	const previousNode2 = previousNode.prev();

	if (previousNode2 && getNodeLine(previousNode) === getNodeLine(previousNode2)) {
		return getPreviousNonSharedLineCommentNode(previousNode);
	}

	return previousNode;
}
