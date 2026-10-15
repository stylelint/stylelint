import { jest } from '@jest/globals';

import memoize from '../memoize.mjs';

describe('memoize', () => {
	it('computes once per key', () => {
		const fn = jest.fn((key) => ({ key }));
		const memoized = memoize(fn);
		const key = {};

		expect(memoized(key)).toBe(memoized(key));
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('computes each key separately', () => {
		const memoized = memoize((key) => ({ key }));

		expect(memoized({})).not.toBe(memoized({}));
	});
});
