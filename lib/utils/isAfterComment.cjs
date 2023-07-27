'use strict';

const isSharedLineComment = require('./isSharedLineComment.cjs');

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
function isAfterComment(node) {
	const previousNode = node.prev();

	if (!previousNode || previousNode.type !== 'comment') {
		return false;
	}

	return !isSharedLineComment(previousNode);
}

module.exports = isAfterComment;
