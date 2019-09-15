/* @flow */
'use strict';

// Remove empty lines before a node. Mutates the node.
function removeEmptyLinesBefore(
	node /*: postcss$node*/,
	newline /*: '\n' | '\r\n'*/,
) /*: postcss$node*/ {
	node.raws.before = node.raws.before.replace(/(\r?\n\s*\r?\n)+/g, newline);

	return node;
}

module.exports = removeEmptyLinesBefore;
