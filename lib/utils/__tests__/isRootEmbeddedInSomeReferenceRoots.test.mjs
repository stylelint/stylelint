import isRootEmbeddedInSomeReferenceRoots from '../isRootEmbeddedInSomeReferenceRoots.mjs';
import postcss from 'postcss';

describe('isRootEmbeddedInSomeReferenceRoots', () => {
	it('is true for the same root', () => {
		// Two different parse calls, but same `from` value.
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootB = postcss.parse('.foo {}', { from: 'foo.css' });

		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(true);

		// internal caches must not affect the outcome
		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(true);
	});

	it('is false for an unrelated root', () => {
		// Two different parse calls, but different `from` value.

		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootB = postcss.parse('.bar {}', { from: 'bar.css' });

		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(false);

		// internal caches must not affect the outcome
		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(false);
	});

	it('is false for roots without `from`', () => {
		const rootA = postcss.parse('.foo {}');
		const rootB = postcss.parse('.foo {}');

		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(false);
	});

	it('is true for an embedded root', () => {
		// parsed for linting
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });

		// parsed reference roots
		const rootB = postcss.parse('.foo {}', { from: 'foo.css' });
		const rootC = postcss.parse('.bar {}', { from: 'bar.css' });

		// bundled by a `loader`
		rootC.first.append(...rootB.nodes);

		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootC])).toBe(true);

		// internal caches must not affect the outcome
		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootC])).toBe(true);
	});

	it('is true for a conditional embedded root', () => {
		// parsed for linting
		const rootA = postcss.parse('.foo {}', { from: 'foo.css' });

		// parsed reference roots
		const rootB = postcss.parse('.bar {} @media print {}', { from: 'bar.css' });
		const rootC = postcss.parse('.foo {}', { from: 'foo.css' });

		// bundled by a `loader`
		rootB.nodes[1].append(...rootC.nodes);

		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(true);

		// internal caches must not affect the outcome
		expect(isRootEmbeddedInSomeReferenceRoots(rootA, [rootB])).toBe(true);
	});
});
