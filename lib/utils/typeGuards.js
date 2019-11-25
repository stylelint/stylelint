'use strict';

/**
 * @param {import('postcss').Node} node
 * @returns {node is import('postcss').Root}
 */
module.exports.isRoot = function isRoot(node) {
	return node.type === 'root';
};
