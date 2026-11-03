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
	const rootFile = getFile(root);

	if (!rootFile) return false;

	for (const referenceRoot of referenceRoots) {
		if (getFile(referenceRoot) === rootFile) return true;

		let referenceFiles = cache.get(referenceRoot);

		if (!referenceFiles) {
			referenceFiles = new Set();

			referenceRoot.walk((childNode) => {
				const referenceFile = getFile(childNode);

				if (referenceFile) /** @type {Set<string>} */ (referenceFiles).add(referenceFile);
			});

			cache.set(referenceRoot, referenceFiles);
		}

		if (referenceFiles.has(rootFile)) return true;
	}

	return false;
}

/**
 * @param {Node} node
 * @returns {string | undefined}
 */
function getFile(node) {
	return node.source?.input.file;
}
