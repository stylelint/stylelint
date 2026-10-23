/** @import { Root, Node } from 'postcss' */

/** @type {WeakMap<Root, Set<string>>} */
const cache = new WeakMap();

/**
 * Check whether a root is embedded in some reference roots.
 *
 * @param {Root} root
 * @param {Root[]} referenceRoots
 * @returns {boolean}
 */
export default function isRootEmbeddedInSomeReferenceRoots(root, referenceRoots) {
	const from = getFrom(root);

	if (!from) return false;

	for (const referenceRoot of referenceRoots) {
		if (getFrom(referenceRoot) === from) return true;

		let sources = cache.get(referenceRoot);

		if (!sources) {
			/** @type {Set<string>} */
			sources = new Set();

			referenceRoot.walk((childNode) => {
				const referenceFrom = getFrom(childNode);

				if (referenceFrom) /** @type {Set<string>} */ (sources).add(referenceFrom);
			});

			cache.set(referenceRoot, sources);
		}

		if (sources.has(from)) return true;
	}

	return false;
}

/**
 * @param {Node} node
 * @returns {string | undefined}
 */
function getFrom(node) {
	const from = node.source?.input.from;

	if (!from) return;

	// When parsing with postcss without `from` `node.source?.input.from` has a value that looks like `<input css w_2MOM>`
	if (from.startsWith('<input css')) return;

	return from;
}
