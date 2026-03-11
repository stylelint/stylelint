/**
 * @typedef {{result: string, before: string}} CacheEntry
 */

/** @type {WeakMap<import('postcss').Node, CacheEntry>} */
const cache = new WeakMap();

/**
 * Stringify PostCSS node including its raw "before" string.
 *
 * @param {import('postcss').Node} node
 *
 * @returns {string}
 */
export default function rawNodeString(node) {
	const cachedEntry = cache.get(node);
	const before = node.raws.before ?? '';

	// Valid cache only if `node.raws.before` is unchanged
	if (cachedEntry && cachedEntry.before === before) {
		return cachedEntry.result;
	}

	const result = before + node.toString();

	cache.set(node, { result, before });

	return result;
}
