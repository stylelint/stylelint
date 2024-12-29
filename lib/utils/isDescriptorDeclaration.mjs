import { isAtRule, isRoot } from './typeGuards.mjs';
import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
export default function isDescriptorDeclaration(decl) {
	const { parent } = decl;

	/** @type {import('postcss').Node['parent']} */
	let node = parent;

	while (node && !isRoot(node)) {
		if (isAtRule(node) && !nestingSupportedAtKeywords.has(node.name.toLowerCase())) return true;

		node = node.parent;
	}

	return false;
}
