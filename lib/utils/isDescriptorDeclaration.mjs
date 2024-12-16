import { isAtRule } from './typeGuards.mjs';
import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
export default function isDescriptorDeclaration(decl) {
	const { parent } = decl;

	if (parent && isAtRule(parent) && !nestingSupportedAtKeywords.has(parent.name.toLowerCase()))
		return true;

	return false;
}
