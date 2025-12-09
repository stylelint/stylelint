import { Node } from 'postcss';

import { isDocument } from './typeGuards.mjs';

/**
 * @param {Node} node
 * @param {{ inline: boolean }} [options]
 * @returns {boolean}
 */
export default function isInDocument(node, options) {
	const { inline = false } = options || {};
	let current = node;

	while (current) {
		if (isDocument(current)) return true;

		// Check for unofficial 'document' property from parsers like postcss-html
		if ('document' in current && current.document instanceof Node && isDocument(current.document)) {
			if (inline && current.source && 'inline' in current.source) {
				return Boolean(current.source.inline);
			}

			return true;
		}

		if (!current.parent) break;

		current = current.parent;
	}

	return false;
}
