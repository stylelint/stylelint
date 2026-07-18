import { isComment, isRoot } from './typeGuards.mjs';
import getNextNonSharedLineCommentNode from './getNextNonSharedLineCommentNode.mjs';
import getPreviousNonSharedLineCommentNode from './getPreviousNonSharedLineCommentNode.mjs';

/** @import { Node as PostcssNode } from 'postcss' */

/**
 * @param {PostcssNode | undefined} a
 * @param {PostcssNode | undefined} b
 */
function nodesShareLines(a, b) {
	const endLine = a && a.source && a.source.end && a.source.end.line;
	const startLine = b && b.source && b.source.start && b.source.start.line;

	return endLine === startLine;
}

/**
 * @param {PostcssNode} node
 * @param {PostcssNode} [ignoredNode] - a node that doesn't count as sharing a line with `node`
 * @returns {boolean}
 */
export default function isSharedLineComment(node, ignoredNode) {
	if (!isComment(node)) {
		return false;
	}

	const previousNonSharedLineCommentNode = getPreviousNonSharedLineCommentNode(node);

	if (nodesShareLines(previousNonSharedLineCommentNode, node)) {
		return true;
	}

	const nextNonSharedLineCommentNode = getNextNonSharedLineCommentNode(node);

	if (
		nextNonSharedLineCommentNode &&
		nextNonSharedLineCommentNode !== ignoredNode &&
		nodesShareLines(node, nextNonSharedLineCommentNode)
	) {
		return true;
	}

	const parentNode = node.parent;

	// It's a first child and located on the same line as block start
	if (
		parentNode !== undefined &&
		!isRoot(parentNode) &&
		parentNode.index(node) === 0 &&
		node.raws.before !== undefined &&
		!node.raws.before.includes('\n')
	) {
		return true;
	}

	return false;
}
