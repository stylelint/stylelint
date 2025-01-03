// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const typeGuards = require('./typeGuards.cjs');

/** @import { Node } from 'postcss' */

const STOP = 'STOP';

/**
 * Iterates over each node up to the root node.
 *
 * @param {Node} node
 * @param {(node: Node) => void | STOP} callback
 * @returns {void}
 */
function eachNodeUpToRoot(node, callback) {
	let currentNode = node.parent;

	while (currentNode && !typeGuards.isRoot(currentNode)) {
		if (callback(currentNode) === STOP) break;

		currentNode = currentNode.parent;
	}
}

exports.STOP = STOP;
exports.default = eachNodeUpToRoot;
