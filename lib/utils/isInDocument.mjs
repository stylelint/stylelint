import { isDocument } from './typeGuards.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export function isInDocument(node) {
	let current = node;

	while (current) {
		if (isDocument(current)) return true;

		// Check if current node has a document property
		if (
			'document' in current &&
			current.document &&
			isDocument(/** @type {import('postcss').Document} */ (current.document))
		)
			return true;

		// Only assign if parent exists
		if (!current.parent) break;

		current = current.parent;
	}

	return false;
}
