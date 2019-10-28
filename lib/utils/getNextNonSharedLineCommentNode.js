/* @flow */
'use strict';

const _ = require('lodash');

/**
 * @param {import('postcss').Node} node
 */
function getNodeLine(node /*:: ?: postcss$node*/) /*: number | void*/ {
	return _.get(node, 'source.start.line');
}

/**
 * @param {import('postcss').Node} node
 */
module.exports = function getNextNonSharedLineCommentNode(
	node /*:: ?: postcss$node*/,
) /*: postcss$node | void*/ {
	if (node === undefined) {
		return undefined;
	}

	const nextNode = node.next();

	if (_.get(nextNode, 'type') !== 'comment') {
		return nextNode;
	}

	if (
		// @ts-ignore
		getNodeLine(node) === getNodeLine(nextNode) ||
		// @ts-ignore
		(nextNode !== undefined && getNodeLine(nextNode) === getNodeLine(nextNode.next()))
	) {
		// @ts-ignore
		return getNextNonSharedLineCommentNode(nextNode);
	}

	return nextNode;
};
