import { resolve } from 'node:path';

/** @import {Node, Root} from 'postcss' */

/**
 * Check whether a root's source file is already embedded in reference roots.
 *
 * @param {Root} root
 * @param {Root[]} referenceRoots
 * @returns {boolean}
 */
export default function isRootIncludedInReferenceRoots(root, referenceRoots) {
	const rootSourcePath = getSourcePath(root);

	if (!rootSourcePath) return false;

	return referenceRoots.some((referenceRoot) => {
		if (getSourcePath(referenceRoot) === rootSourcePath) return true;

		let found = false;

		referenceRoot.walk((node) => {
			if (getSourcePath(node) === rootSourcePath) {
				found = true;
			}
		});

		return found;
	});
}

/**
 * @param {Node | Root} node
 * @returns {string | undefined}
 */
function getSourcePath(node) {
	const sourcePath = node.source?.input.from;

	if (!sourcePath) return undefined;

	return resolve(sourcePath);
}
