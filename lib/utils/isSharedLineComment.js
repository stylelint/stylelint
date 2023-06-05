'use strict';

const getNextNonSharedLineCommentNode = require('./getNextNonSharedLineCommentNode');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const { isRoot, isComment } = require('./typeGuards');

/** @typedef {import('postcss').Node} PostcssNode */

/**
 *
 * @param {PostcssNode | void} a
 * @param {PostcssNode | void} b
 */
function nodesShareLines(a, b) {
	const endLine = a && a.source && a.source.end && a.source.end.line;
	const startLine = b && b.source && b.source.start && b.source.start.line;

	return endLine === startLine;
}

/**
 * @param {PostcssNode} node
 * @returns {boolean}
 */
module.exports = function isSharedLineComment(node) {
	if (!isComment(node)) {
		return false;
	}

	const previousNonSharedLineCommentNode = getPreviousNonSharedLineCommentNode(node);

	if (nodesShareLines(previousNonSharedLineCommentNode, node)) {
		return true;
	}

	const nextNonSharedLineCommentNode = getNextNonSharedLineCommentNode(node);

	if (nextNonSharedLineCommentNode && nodesShareLines(node, nextNonSharedLineCommentNode)) {
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
};
