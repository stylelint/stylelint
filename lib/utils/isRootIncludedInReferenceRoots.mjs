import { resolve } from 'node:path';

/** @import {Node, Root} from 'postcss' */

const referenceRootSourcePathsCache = new WeakMap();

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

	return getReferenceRootSourcePaths(referenceRoots).has(rootSourcePath);
}

/**
 * @param {Root[]} referenceRoots
 * @returns {Set<string>}
 */
function getReferenceRootSourcePaths(referenceRoots) {
	const cachedSourcePaths = referenceRootSourcePathsCache.get(referenceRoots);

	if (cachedSourcePaths) return cachedSourcePaths;

	const sourcePaths = new Set();

	for (const referenceRoot of referenceRoots) {
		addSourcePath(sourcePaths, referenceRoot);
		referenceRoot.walk((node) => addSourcePath(sourcePaths, node));
	}

	referenceRootSourcePathsCache.set(referenceRoots, sourcePaths);

	return sourcePaths;
}

/**
 * @param {Set<string>} sourcePaths
 * @param {Node | Root} node
 */
function addSourcePath(sourcePaths, node) {
	const sourcePath = getSourcePath(node);

	if (sourcePath) {
		sourcePaths.add(sourcePath);
	}
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
