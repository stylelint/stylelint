// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

const isStandardSyntaxFunction = require('./isStandardSyntaxFunction.cjs');

/**
 * Check whether a function is standard syntax color function
 *
 * @param {import('postcss-value-parser').FunctionNode} node
 * @returns {boolean}
 */
function isStandardSyntaxColorFunction(node) {
	if (!isStandardSyntaxFunction(node)) return false;

	// scss can accept a #hex, or $var variables and we need to check all nested fn nodes
	for (const fnNode of node.nodes) {
		if (fnNode.type === 'function') return isStandardSyntaxColorFunction(fnNode);

		if (
			fnNode.type === 'word' &&
			(fnNode.value.startsWith('#') || fnNode.value.startsWith('$') || fnNode.value.includes('.$'))
		)
			return false;
	}

	return true;
}

module.exports = isStandardSyntaxColorFunction;
