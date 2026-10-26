import { describe, it, mock } from 'node:test';

import postcss from 'postcss';

import memoizeForReferenceRoots from '../memoizeForReferenceRoots.mjs';

describe('memoizeForReferenceRoots', () => {
	const root = postcss.parse('a {}');
	const referenceRoot = postcss.parse('b {}');

	it('returns the results in source order', (t) => {
		const getSelector = memoizeForReferenceRoots((node) => node.first.selector);

		t.assert.deepStrictEqual(getSelector(root, [referenceRoot]), ['b', 'a']);
	});

	it('computes the reference roots once and the root each time', (t) => {
		const fn = mock.fn((node) => node.first.selector);
		const getSelector = memoizeForReferenceRoots(fn);

		getSelector(root, [referenceRoot]);
		getSelector(root, [referenceRoot]);

		t.assert.strictEqual(fn.mock.callCount(), 3);
	});
});
