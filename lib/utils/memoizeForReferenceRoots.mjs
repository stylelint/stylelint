import memoize from './memoize.mjs';

/** @import {Root} from 'postcss' */

/**
 * `fn` over the reference roots, computed once as they're shared across linted files, then over
 * the root, afresh as it isn't, in source order
 *
 * @template V
 * @param {(root: Root) => V} fn
 * @returns {(root: Root, referenceRoots: Root[]) => V[]}
 */
export default function memoizeForReferenceRoots(fn) {
	const memoized = memoize(fn);

	return (root, referenceRoots) => [...referenceRoots.map(memoized), fn(root)];
}
