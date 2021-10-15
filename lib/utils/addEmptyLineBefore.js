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
	const { raws } = node;

	if (typeof raws.before !== 'string') {
		return node;
	}

	raws.before = !/\r?\n/.test(raws.before)
		? newline.repeat(2) + raws.before
		: raws.before.replace(/(\r?\n)/, `${newline}$1`);

	return node;
};
