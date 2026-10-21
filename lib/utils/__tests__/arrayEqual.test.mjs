import { describe, it } from 'node:test';

import arrayEqual from '../arrayEqual.mjs';

describe('arrayEqual', () => {
	it('handles arrays', (t) => {
		t.assert.strictEqual(arrayEqual([], []), true);
		t.assert.strictEqual(arrayEqual([1, 2], [1, 2]), true);
		t.assert.strictEqual(arrayEqual([1, 2], [3, 4]), false);
		t.assert.strictEqual(arrayEqual([1, 2], [1, 2, 3]), false);
		t.assert.strictEqual(arrayEqual([1, 2], []), false);

		const o1 = { a: 1, b: 2 };
		const o2 = { a: 1, b: 2 };
		const o1copy = o1;

		t.assert.strictEqual(arrayEqual([o1], [o2]), false);
		t.assert.strictEqual(arrayEqual([o1], [o1copy]), true);
	});

	it('returns false for non-arrays', (t) => {
		t.assert.strictEqual(arrayEqual({ a: 1 }, [1]), false);
		t.assert.strictEqual(arrayEqual([1], /1/), false);
	});
});
