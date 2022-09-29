'use strict';

const { isRoot } = require('./typeGuards');

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
module.exports = function isFirstNodeOfRoot(node) {
	if (isRoot(node)) return false;

	const parentNode = node.parent;

	if (!parentNode) {
		return false;
	}

	return isRoot(parentNode) && node === parentNode.first;
};
