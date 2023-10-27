// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

const typeGuards = require('./typeGuards.cjs');
const getNextNonSharedLineCommentNode = require('./getNextNonSharedLineCommentNode.cjs');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode.cjs');

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
function isSharedLineComment(node) {
	if (!typeGuards.isComment(node)) {
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
		!typeGuards.isRoot(parentNode) &&
		parentNode.index(node) === 0 &&
		node.raws.before !== undefined &&
		!node.raws.before.includes('\n')
	) {
		return true;
	}

	return false;
}

module.exports = isSharedLineComment;
