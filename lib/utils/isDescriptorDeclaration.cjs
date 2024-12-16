// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const typeGuards = require('./typeGuards.cjs');
const atKeywords = require('../reference/atKeywords.cjs');

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isDescriptorDeclaration(decl) {
	const { parent } = decl;

	/** @type {import('postcss').Node | undefined} */
	let node = parent;

	while (node && node.type !== 'root') {
		if (typeGuards.isAtRule(node) && !atKeywords.nestingSupportedAtKeywords.has(node.name.toLowerCase())) return true;

		node = node.parent;
	}

	return false;
}

module.exports = isDescriptorDeclaration;
