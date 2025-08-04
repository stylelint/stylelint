import { isDocument } from './typeGuards.mjs';

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export function isInDocument({ parent }) {
	return Boolean(parent && (isDocument(parent) || 'document' in parent));
}
