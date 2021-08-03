'use strict';

/**
 * Add an empty line after a node. Mutates the node.
 *
 * @template {import('postcss').Rule | import('postcss').AtRule} T
 * @param {T} node
 * @param {string} newline
 * @returns {T}
 */
module.exports = function addEmptyLineAfter(node, newline) {
	const { raws } = node;

	if (typeof raws.after !== 'string') {
		return node;
	}

	const spaces = raws.after.split(';');
	const after = spaces[spaces.length - 1] || '';

	if (!/\r?\n/.test(after)) {
		raws.after += newline.repeat(2);
	} else {
		raws.after = raws.after.replace(/(\r?\n)/, `${newline}$1`);
	}

	return node;
};
