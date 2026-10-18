import memoize from './memoize.mjs';

/** @import {Root} from 'postcss' */

/**
 * `compute` over the reference roots, run once as they're shared across linted files, then over
 * the root, afresh as it isn't, in source order
 *
 * @template V
 * @param {(root: Root) => V} compute
 * @returns {(root: Root, referenceRoots: Root[]) => V[]}
 */
export default function memoizeForReferenceRoots(compute) {
	const memoized = memoize(compute);

	return (root, referenceRoots) => [...referenceRoots.map(memoized), compute(root)];
}
