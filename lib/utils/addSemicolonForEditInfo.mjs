/** @import { Node as PostcssNode } from 'postcss' */
import { isAtRule, isDeclaration } from './typeGuards.mjs';

/**
 * Adjust the text in EditInfo to include a semicolon when needed.
 *
 * @param {PostcssNode} node
 * @param {{range: [number, number], text: string}} fixData
 * @returns {{range: [number, number], text: string}}
 */
export default function addSemicolonForEditInfo(node, fixData) {
	const { parent } = node;

	if (!parent) return fixData;

	if (isDeclaration(node)) {
		if (parent.raws.semicolon || parent.last !== node) {
			return {
				...fixData,
				text: `${fixData.text};`,
			};
		}
	}

	if (isAtRule(node)) {
		if (!node.nodes && (parent.raws.semicolon || parent.last !== node)) {
			return {
				...fixData,
				text: `${fixData.text};`,
			};
		}
	}

	return fixData;
}
