import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import postcss from 'postcss';

import memoizeForReferenceRoots from '../memoizeForReferenceRoots.mjs';

describe('memoizeForReferenceRoots', () => {
	const root = postcss.parse('a {}');
	const referenceRoot = postcss.parse('b {}');

	it('returns the results in source order', () => {
		const getSelector = memoizeForReferenceRoots((node) => node.first.selector);

		assert.deepEqual(getSelector(root, [referenceRoot]), ['b', 'a']);
	});

	it('computes the reference roots once and the root each time', () => {
		const fn = mock.fn((node) => node.first.selector);
		const getSelector = memoizeForReferenceRoots(fn);

		getSelector(root, [referenceRoot]);
		getSelector(root, [referenceRoot]);

		assert.equal(fn.mock.callCount(), 3);
	});
});
