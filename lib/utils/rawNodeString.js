/* @flow */
'use strict';

/**
 * Stringify PostCSS node including its raw "before" string.
 *
 * @param {import('postcss').Node} node
 *
 * @returns {string}
 */
module.exports = function(node /*: Object*/) /*: string*/ {
	let result = '';

	if (node.raws.before) {
		result += node.raws.before;
	}

	result += node.toString();

	return result;
};
