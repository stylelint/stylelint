/* @flow */
'use strict';

const _ = require('lodash');
const getNextNonSharedLineCommentNode = require('./getNextNonSharedLineCommentNode');
const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');

function nodesShareLines(a, b) {
	return _.get(a, 'source.end.line') === _.get(b, 'source.start.line');
}

module.exports = function isSharedLineComment(node /*: postcss$node*/) /*: boolean*/ {
	if (node.type !== 'comment') {
		return false;
	}

	const previousNonSharedLineCommentNode = getPreviousNonSharedLineCommentNode(node);

	if (nodesShareLines(previousNonSharedLineCommentNode, node)) {
		return true;
	}

	const nextNonSharedLineCommentNode = getNextNonSharedLineCommentNode(node);

	if (nodesShareLines(node, nextNonSharedLineCommentNode)) {
		return true;
	}

	const parentNode = node.parent;

	// It's a first child and located on the same line as block start
	if (
		parentNode !== undefined &&
		parentNode.type !== 'root' &&
		parentNode.index(node) === 0 &&
		!node.raws.before.includes('\n')
	) {
		return true;
	}

	return false;
};
