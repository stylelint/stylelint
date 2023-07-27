'use strict';

const typeGuards = require('./typeGuards.cjs');

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
function isFirstNodeOfRoot(node) {
	if (typeGuards.isRoot(node)) return false;

	const parentNode = node.parent;

	if (!parentNode) {
		return false;
	}

	return typeGuards.isRoot(parentNode) && node === parentNode.first;
}

module.exports = isFirstNodeOfRoot;
