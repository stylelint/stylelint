import { isBoolean } from './validateTypes.mjs';
import { referenceRootWasParsedWithLoader } from './getReferenceRoots.mjs';

/** @import { Root, Node } from 'postcss' */

/** @type {WeakMap<Root, WeakMap<Node, boolean>>} */
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
		if (!referenceRootWasParsedWithLoader(referenceRoot)) continue;

		const cachedLookup = cache.get(referenceRoot) ?? new WeakMap();

		let isIncluded = cachedLookup.get(root);

		if (isIncluded) return true;

		if (!isBoolean(isIncluded)) {
			isIncluded = false;

			// Most bundles will result in top level nodes from individual files.
			referenceRoot.each((childNode) => {
				if (getFrom(childNode) !== from) return;

				isIncluded = true;

				return false;
			});

			if (isIncluded) {
				cachedLookup.set(root, isIncluded);
				cache.set(referenceRoot, cachedLookup);

				return true;
			}

			// Bundles with conditional imports (e.g. `@import foo.css print;`) do require a full walk.
			referenceRoot.walk((childNode) => {
				if (getFrom(childNode) !== from) return;

				isIncluded = true;

				return false;
			});

			cachedLookup.set(root, isIncluded);
			cache.set(referenceRoot, cachedLookup);
		}

		if (isIncluded) return true;
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
