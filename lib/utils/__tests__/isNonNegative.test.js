'use strict';

const isNonNegative = require('../isNonNegative');

describe('isNonNegative', () => {
	it('returns true', () => {
		expect(isNonNegative(0)).toBe(true);
		expect(isNonNegative(1)).toBe(true);
		expect(isNonNegative(0.1)).toBe(true);
		expect(isNonNegative(1.1)).toBe(true);
	});

	it('returns false', () => {
		expect(isNonNegative(-1)).toBe(false);
		expect(isNonNegative(-0.1)).toBe(false);
		expect(isNonNegative(NaN)).toBe(false);
	});

	it('returns false for non-numbers', () => {
		expect(isNonNegative('1')).toBe(false);
		expect(isNonNegative('0')).toBe(false);
		expect(isNonNegative(null)).toBe(false);
		expect(isNonNegative({})).toBe(false);
		expect(isNonNegative([])).toBe(false);
	});
});
