'use strict';

/** @typedef {import('postcss').ChildNode & { raws: import('postcss').ChildNode['raws'] & { after?: string } }} ChildNode */

/**
 * Add an empty line after a node. Mutates the node.
 *
 * @param {ChildNode} node
 * @param {'\n' | '\r\n'} newline
 * @returns {ChildNode}
 */
function addEmptyLineAfter(node, newline) {
	if (node.raws.after === undefined) {
		return node;
	}

	const spaces = node.raws.after.split(';');
	const after = spaces[spaces.length - 1] || '';

	if (!/\r?\n/.test(after)) {
		node.raws.after += newline.repeat(2);
	} else {
		node.raws.after = node.raws.after.replace(/(\r?\n)/, `${newline}$1`);
	}

	return node;
}

module.exports = addEmptyLineAfter;
