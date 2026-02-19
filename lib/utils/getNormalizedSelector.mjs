/** @import { Root, Selector } from 'postcss-selector-parser' */
/** @import { PostcssResult } from 'stylelint' */

import normalizeSelector from './normalizeSelector.mjs';

/**
 * @template T
 * @typedef {{ node: T, string: string }} NormalizedEntry<T>
 */

/** @type {WeakMap<Root | Selector, Map<PostcssResult, NormalizedEntry<any>>>} */
const cache = new WeakMap();

/** @type {Map<string, NormalizedEntry<any>>} */
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
 * @returns {NormalizedEntry<T>}
 */
export default function getNormalizedSelector(node, result) {
	let nodeCache = cache.get(node);

	if (nodeCache) {
		const cached = nodeCache.get(result);

		if (cached) return cached;
	} else {
		nodeCache = new Map();
		cache.set(node, nodeCache);
	}

	const selectorString = node.toString();
	const cachedByString = stringCache.get(selectorString);

	if (cachedByString) {
		nodeCache.set(result, cachedByString);

		return cachedByString;
	}

	const normalizedNode = /** @type {T} */ (normalizeSelector(node.clone()));
	const entry = { node: normalizedNode, string: normalizedNode.toString() };

	nodeCache.set(result, entry);

	if (stringCache.size >= MAX_STRING_CACHE_SIZE) {
		const oldestKey = stringCache.keys().next().value;

		if (oldestKey !== undefined) stringCache.delete(oldestKey);
	}

	stringCache.set(selectorString, entry);

	return entry;
}
