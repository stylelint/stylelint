import { describe, it } from 'node:test';

import postcss from 'postcss';

import isRootEmbeddedInSomeReferenceRoots from '../isRootEmbeddedInSomeReferenceRoots.mjs';

describe('isRootEmbeddedInSomeReferenceRoots', () => {
	it('is true for the same root', (t) => {
		// Two different parse calls, but same `from` value.
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootB = postcss.parse('.foo {}', { from: 'foo.css' });

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), true);

		// internal caches must not affect the outcome
		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), true);
	});

	it('is false for an unrelated root', (t) => {
		// Two different parse calls, but different `from` value.

		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootB = postcss.parse('.bar {}', { from: 'bar.css' });

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), false);

		// internal caches must not affect the outcome
		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), false);
	});

	it('is false for roots without `from`', (t) => {
		const rootA = postcss.parse('.foo {}');
		const rootB = postcss.parse('.foo {}');

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), false);
	});

	it('is false for roots without a source', (t) => {
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootB = postcss.parse('.foo {}', { from: 'foo.css' });

		delete rootA.source;

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), false);
	});

	it('is false for roots parsed without a real `from`', (t) => {
		const rootA = postcss.parse('.foo {}');
		const rootB = postcss.parse('.foo {}', { from: rootA.source?.input.from });

		t.assert.match(rootA.source?.input.from ?? '', /^<input css/);
		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), false);
	});

	it('is true for an embedded root', (t) => {
		// parsed for linting
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });

		// parsed reference roots
		const rootB = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootC = postcss.parse('.bar {}', { from: 'bar.css' });

		// bundled by a `loader`
		rootC.first.append(...rootB.nodes);

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootC]), true);

		// internal caches must not affect the outcome
		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootC]), true);
	});

	it('is true for a conditional embedded root', (t) => {
		// parsed for linting
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });

		// parsed reference roots
		const rootB = postcss.parse('.bar {} @media print {}', { from: 'bar.css' });
		const rootC = postcss.parse('.foo {}', { from: 'foo.css' });

		// bundled by a `loader`
		rootB.nodes[1].append(...rootC.nodes);

		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), true);

		// internal caches must not affect the outcome
		t.assert.strictEqual(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB]), true);
	});
});
