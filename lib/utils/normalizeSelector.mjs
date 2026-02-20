import parser from 'postcss-selector-parser';

/** @import { Node, Root, Selector } from 'postcss-selector-parser' */
/** @import { PostcssResult } from 'stylelint' */

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
 * Normalize a selector node so that it can be more easily compared to other selectors
 * Uses two-tier caching to minimise cloning:
 * - Result-scoped cache for within-file reuse
 * - Bounded string cache for cross-file reuse
 *
 * @template {Root | Selector} T
 * @param {T} node
 * @param {PostcssResult} result
 * @returns {NormalizedEntry<T>}
 */
export default function normalizeSelector(node, result) {
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

	const normalizedNode = /** @type {T} */ (normalize(node.clone()));
	const entry = { node: normalizedNode, string: normalizedNode.toString() };

	nodeCache.set(result, entry);

	if (stringCache.size >= MAX_STRING_CACHE_SIZE) {
		const oldestKey = stringCache.keys().next().value;

		if (oldestKey !== undefined) stringCache.delete(oldestKey);
	}

	stringCache.set(selectorString, entry);

	return entry;
}

/**
 * @template {Root | Selector} T
 * @param {T} node
 * @returns {T}
 */
function normalize(node) {
	normalizeNodeEscaping(node);
	normalizeSelectorNodeWhitespaceAndComments(node);

	node.walk((child) => {
		normalizeNodeEscaping(child);
		normalizeSelectorNodeWhitespaceAndComments(child);
	});

	normalizeSelectorNodesOrder(node);

	return node;
}

/**
 * @param {Node} node
 */
function normalizeSelectorNodeWhitespaceAndComments(node) {
	if (parser.isComment(node)) {
		node.remove();

		return;
	}

	node.rawSpaceBefore = '';
	node.rawSpaceAfter = '';

	node.spaces.before = '';
	node.spaces.after = '';

	if (parser.isAttribute(node)) {
		delete node.spaces.insensitive;
		delete node.spaces.operator;
		delete node.spaces.attribute;
		delete node.spaces.value;

		delete node.raws.spaces;
	}
}

/**
 * @param {Node} node
 */
function normalizeSelectorNodesOrder(node) {
	if (!parser.isContainer(node)) return;

	// Need to sort inside out, not outside in.
	// As the parents needs to sorted with their children already in the right order.
	node.each(normalizeSelectorNodesOrder);

	if (parser.isRoot(node) || parser.isPseudoClass(node) || parser.isPseudoElement(node)) {
		const nodes = node.nodes.map((childNode) => {
			// Make sure to only stringify the node once.
			return { node: childNode, string: childNode.toString() };
		});

		nodes.sort((a, b) => a.string.localeCompare(b.string));

		const uniqueNodes = new Set();
		const nodesIndices = new Map();

		nodes.forEach((x, i) => {
			if (uniqueNodes.has(x.string)) return;

			uniqueNodes.add(x.string);
			nodesIndices.set(x.node, i);
		});

		node.nodes = node.nodes
			.filter((childNode) => {
				return nodesIndices.has(childNode);
			})
			.sort((a, b) => {
				return nodesIndices.get(a) - nodesIndices.get(b);
			});
	}
}

/**
 * Normalize CSS escaping in selector node values.
 * Field getters return unescaped values, setters handle re-escaping.
 * Setting a field to itself normalizes the escaping representation.
 * This ensures selectors like `.u-m\00002b` and `.u-m\+` are treated as equivalent.
 *
 * @see https://github.com/postcss/postcss-selector-parser/blob/1b1e9c3bc10ccc3bc5f07a987caa7f2684c0b52f/src/selectors/className.js#L13-L28
 * @param {Node} node
 */
function normalizeNodeEscaping(node) {
	if (parser.isClassName(node)) {
		// @ts-expect-error -- The `raws` property exists, but isn't exposed in the type. This check provides a performance benefit by avoiding extra escaping.
		if (!node.raws?.value) return;

		// eslint-disable-next-line no-self-assign -- Intentional: setter normalizes escaping
		node.value = node.value;
	}
}
