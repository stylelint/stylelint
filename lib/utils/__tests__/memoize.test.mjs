import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import memoize from '../memoize.mjs';

describe('memoize', () => {
	it('computes once per key', () => {
		const fn = mock.fn((key) => ({ key }));
		const memoized = memoize(fn);
		const key = {};

		assert.equal(memoized(key), memoized(key));
		assert.equal(fn.mock.callCount(), 1);
	});

	it('computes each key separately', () => {
		const memoized = memoize((key) => ({ key }));

		assert.notEqual(memoized({}), memoized({}));
	});
});
