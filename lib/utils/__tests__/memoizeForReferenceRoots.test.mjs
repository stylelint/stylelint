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

	it('leaves out the root when a reference root embeds it', (t) => {
		// Two parse calls with the same `from`, as when a loader bundles the linted file
		const embeddedRoot = postcss.parse('a {}', { from: 'a.css' });
		const embeddingRoot = postcss.parse('b {}', { from: 'b.css' });

		embeddingRoot.append(...embeddedRoot.nodes);

		const fn = mock.fn((node) => node.first.selector);
		const getSelector = memoizeForReferenceRoots(fn);

		t.assert.deepStrictEqual(getSelector(embeddedRoot, [embeddingRoot]), ['b']);
		t.assert.strictEqual(fn.mock.callCount(), 1);
	});
});
