import isRootEmbeddedInSomeReferenceRoots from './isRootEmbeddedInSomeReferenceRoots.mjs';
import memoize from './memoize.mjs';

/** @import {Root} from 'postcss' */

/**
 * `compute` over the reference roots, run once as they're shared across linted files, then over
 * the root, afresh as it isn't, in source order. The root is left out when a reference root
 * already embeds it, as its position there is more representative.
 *
 * @template V
 * @param {(root: Root) => V} compute
 * @returns {(root: Root, referenceRoots: Root[]) => V[]}
 */
export default function memoizeForReferenceRoots(compute) {
	const memoized = memoize(compute);

	return (root, referenceRoots) =>
		isRootEmbeddedInSomeReferenceRoots(root, referenceRoots)
			? referenceRoots.map(memoized)
			: [...referenceRoots.map(memoized), compute(root)];
}
