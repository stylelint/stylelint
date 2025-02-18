/** @import { Node as PostcssNode } from 'postcss' */

/**
 * Adjust the text in EditInfo to include a semicolon when needed.
 *
 * @param {PostcssNode} node
 * @param {{range: [number, number], text: string}} fixData
 * @returns {{range: [number, number], text: string}}
 */
export default function addSemicolonForEditInfo(node, fixData) {
	if (fixData.text[fixData.text.length - 1] === ';') return fixData;

	if (node.type === 'decl') {
		if (node.parent?.raws.semicolon || node.parent?.last !== node) {
			return {
				...fixData,
				text: `${fixData.text};`,
			};
		}
	}

	if (node.type === 'atrule') {
		if (!('nodes' in node) && (node.parent?.raws.semicolon || node.parent?.last !== node)) {
			return {
				...fixData,
				text: `${fixData.text};`,
			};
		}
	}

	return fixData;
}
