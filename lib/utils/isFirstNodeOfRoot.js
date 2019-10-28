// @ts-nocheck
/* @flow */
'use strict';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
module.exports = function(node /*: postcss$node*/) /*: boolean*/ {
	const parentNode = node.parent;

	return parentNode.type === 'root' && node === parentNode.first;
};
