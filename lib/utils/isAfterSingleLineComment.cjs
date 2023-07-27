'use strict';

const isSharedLineComment = require('./isSharedLineComment.cjs');

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
function isAfterSingleLineComment(node) {
	const prevNode = node.prev();

	return (
		prevNode !== undefined &&
		prevNode.type === 'comment' &&
		!isSharedLineComment(prevNode) &&
		prevNode.source !== undefined &&
		prevNode.source.start !== undefined &&
		prevNode.source.end !== undefined &&
		prevNode.source.start.line === prevNode.source.end.line
	);
}

module.exports = isAfterSingleLineComment;
