import { isDocument } from './typeGuards.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isInDocument(node) {
	let current = node;

	while (current) {
		if (isDocument(current)) return true;

		// Check for unofficial 'document' property from parsers like postcss-html
		if (
			'document' in current &&
			current.document &&
			isDocument(/** @type {import('postcss').Document} */ (current.document))
		)
			return true;

		if (!current.parent) break;

		current = current.parent;
	}

	return false;
}
