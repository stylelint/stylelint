'use strict';

const arrayEqual = require('../arrayEqual');

describe('arrayEqual', () => {
	it('handles arrays', () => {
		expect(arrayEqual([], [])).toBe(true);
		expect(arrayEqual([1, 2], [1, 2])).toBe(true);
		expect(arrayEqual([1, 2], [3, 4])).toBe(false);
		expect(arrayEqual([1, 2], [1, 2, 3])).toBe(false);
		expect(arrayEqual([1, 2], [])).toBe(false);

		const o1 = { a: 1, b: 2 };
		const o2 = { a: 1, b: 2 };
		const o1copy = o1;

		expect(arrayEqual([o1], [o2])).toBe(false);
		expect(arrayEqual([o1], [o1copy])).toBe(true);
	});

	it('returns false for non-arrays', () => {
		expect(arrayEqual({ a: 1 }, [1])).toBe(false);
		expect(arrayEqual([1], /1/)).toBe(false);
	});
});
