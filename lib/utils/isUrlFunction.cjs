// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const typeGuards = require('./typeGuards.cjs');

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').FunctionNode}
 */
function isUrlFunction(node) {
	return typeGuards.isValueFunction(node) && node.value.toLowerCase() === 'url';
}

module.exports = isUrlFunction;
