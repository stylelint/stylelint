import { describe, it, mock } from 'node:test';

import memoize from '../memoize.mjs';

describe('memoize', () => {
	it('computes once per key', (t) => {
		const fn = mock.fn((key) => ({ key }));
		const memoized = memoize(fn);
		const key = {};

		t.assert.strictEqual(memoized(key), memoized(key));
		t.assert.strictEqual(fn.mock.callCount(), 1);
	});

	it('computes each key separately', (t) => {
		const memoized = memoize((key) => ({ key }));

		t.assert.notStrictEqual(memoized({}), memoized({}));
	});
});
