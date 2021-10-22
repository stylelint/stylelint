'use strict';

/**
 * Remove empty lines before a node. Mutates the node.
 *
 * @template {import('postcss').Rule | import('postcss').AtRule} T
 * @param {T} node
 * @param {string} newline
 * @returns {T}
 */
module.exports = function removeEmptyLinesAfter(node, newline) {
	node.raws.after = node.raws.after ? node.raws.after.replace(/(\r?\n\s*\n)+/g, newline) : '';

	return node;
};
