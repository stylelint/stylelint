import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import arrayEqual from '../arrayEqual.mjs';

describe('arrayEqual', () => {
	it('handles arrays', () => {
		assert.equal(arrayEqual([], []), true);
		assert.equal(arrayEqual([1, 2], [1, 2]), true);
		assert.equal(arrayEqual([1, 2], [3, 4]), false);
		assert.equal(arrayEqual([1, 2], [1, 2, 3]), false);
		assert.equal(arrayEqual([1, 2], []), false);

		const o1 = { a: 1, b: 2 };
		const o2 = { a: 1, b: 2 };
		const o1copy = o1;

		assert.equal(arrayEqual([o1], [o2]), false);
		assert.equal(arrayEqual([o1], [o1copy]), true);
	});

	it('returns false for non-arrays', () => {
		assert.equal(arrayEqual({ a: 1 }, [1]), false);
		assert.equal(arrayEqual([1], /1/), false);
	});
});
