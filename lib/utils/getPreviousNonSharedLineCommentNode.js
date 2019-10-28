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
module.exports = function getPreviousNonSharedLineCommentNode(
	node /*:: ?: postcss$node*/,
) /*: postcss$node | void*/ {
	if (node === undefined) {
		return undefined;
	}

	const previousNode = node.prev();

	if (_.get(previousNode, 'type') !== 'comment') {
		return previousNode;
	}

	if (
		// @ts-ignore
		getNodeLine(node) === getNodeLine(previousNode) ||
		// @ts-ignore
		(previousNode !== undefined && getNodeLine(previousNode) === getNodeLine(previousNode.prev()))
	) {
		// @ts-ignore
		return getPreviousNonSharedLineCommentNode(previousNode);
	}

	return previousNode;
};
