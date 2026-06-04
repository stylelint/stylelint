import path from 'node:path';

import normalizeFilePath from './normalizeFilePath.mjs';

/** @import { Root, ChildNode } from 'postcss' */

/**
 * Check whether a linted root is already embedded in any reference root.
 *
 * @param {Root} root
 * @param {Root[]} referenceRoots
 * @returns {boolean}
 */
export default function isRootIncludedInReferenceRoots(root, referenceRoots) {
	const rootFile = getAbsoluteSourcePath(root);

	if (!rootFile) return false;

	return referenceRoots.some((referenceRoot) => {
		if (getAbsoluteSourcePath(referenceRoot) === rootFile) return true;

		let isIncluded = false;

		referenceRoot.walk((node) => {
			if (getAbsoluteSourcePath(node) !== rootFile) return;

			isIncluded = true;

			return false;
		});

		return isIncluded;
	});
}

/**
 * @param {Root | ChildNode} node
 * @returns {string | undefined}
 */
function getAbsoluteSourcePath(node) {
	const from = node.source?.input.from;

	if (!from) return undefined;

	return normalizeFilePath(path.resolve(from));
}
