/** @import { Root, Selector } from 'postcss-selector-parser' */
/** @import { PostcssResult } from 'stylelint' */

import normalizeSelector from './normalizeSelector.mjs';

/** @typedef {{ node: Root | Selector, string: string }} NormalizedEntry */

/** @type {WeakMap<Root | Selector, Map<PostcssResult, NormalizedEntry>>} */
const cache = new WeakMap();

/** @type {Map<string, NormalizedEntry>} */
const stringCache = new Map();
const MAX_STRING_CACHE_SIZE = 10000;

/**
 * Clone and normalize a selector node with two-tier caching:
 * - Result-scoped cache for within-file reuse
 * - Bounded string cache for cross-file reuse
 *
 * @template {Root | Selector} T
 * @param {T} node
 * @param {PostcssResult} result
 * @returns {{ node: T, string: string }}
 */
export default function getNormalizedSelector(node, result) {
	let nodeCache = cache.get(node);

	if (nodeCache) {
		const cached = nodeCache.get(result);

		if (cached) return /** @type {{ node: T, string: string }} */ (cached);
	} else {
		nodeCache = new Map();
		cache.set(node, nodeCache);
	}

	const selectorString = node.toString();
	const cachedByString = stringCache.get(selectorString);

	if (cachedByString) {
		nodeCache.set(result, cachedByString);

		return /** @type {{ node: T, string: string }} */ (cachedByString);
	}

	const normalizedNode = normalizeSelector(node.clone());
	const entry = { node: normalizedNode, string: normalizedNode.toString() };

	nodeCache.set(result, entry);

	if (stringCache.size >= MAX_STRING_CACHE_SIZE) {
		const oldestKey = stringCache.keys().next().value;

		if (oldestKey !== undefined) stringCache.delete(oldestKey);
	}

	stringCache.set(selectorString, entry);

	return /** @type {{ node: T, string: string }} */ (entry);
}
