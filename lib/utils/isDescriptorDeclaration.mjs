import { isAtRule, isRule } from './typeGuards.mjs';
import findNodeUpToRoot from './findNodeUpToRoot.mjs';
import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

/** @import { Declaration, Node } from 'postcss' */

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {Declaration} decl
 * @returns {boolean}
 */
export default function isDescriptorDeclaration(decl) {
	const parentRule = findNodeUpToRoot(
		decl,
		(node) => isRule(node) || isAtRuleSupportingDescriptors(node),
	);

	return isAtRule(parentRule);
}

/**
 * @param {Node} node
 */
function isAtRuleSupportingDescriptors(node) {
	return isAtRule(node) && !nestingSupportedAtKeywords.has(node.name.toLowerCase());
}
