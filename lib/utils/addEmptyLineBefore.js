'use strict';

/**
 * Add an empty line before a node. Mutates the node.
 *
 * @template {import('postcss').ChildNode} T
 * @param {T} node
 * @param {string} newline
 * @returns {T}
 */
module.exports = function addEmptyLineBefore(node, newline) {
	if (node.raws.before === undefined) {
		return node;
	}

	if (!/\r?\n/.test(node.raws.before)) {
		node.raws.before = newline.repeat(2) + node.raws.before;
	} else {
		node.raws.before = node.raws.before.replace(/(\r?\n)/, `${newline}$1`);
	}

	return node;
};
