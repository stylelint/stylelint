import { Node } from 'postcss';

import { isDocument } from './typeGuards.mjs';

/**
 * @param {Node} node
 * @returns {boolean}
 */
export default function isInInlineDocument(node) {
	let current = node;

	while (current) {
		if (isDocument(current)) return true;

		// Check for unofficial 'document' property from parsers like postcss-html
		if ('document' in current && current.document instanceof Node && isDocument(current.document)) {
			// The diff with `isInDocument`
			if (current.source && 'inline' in current.source) {
				return Boolean(current.source.inline);
			}

			return true;
		}

		if (!current.parent) break;

		current = current.parent;
	}

	return false;
}
