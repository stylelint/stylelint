'use strict';

const isNonNegativeInteger = require('../isNonNegativeInteger');

describe('isNonNegativeInteger', () => {
	it('returns true', () => {
		expect(isNonNegativeInteger(0)).toBe(true);
		expect(isNonNegativeInteger(1)).toBe(true);
	});

	it('returns false', () => {
		expect(isNonNegativeInteger(-1)).toBe(false);
		expect(isNonNegativeInteger(-0.1)).toBe(false);
		expect(isNonNegativeInteger(0.1)).toBe(false);
		expect(isNonNegativeInteger(NaN)).toBe(false);
	});

	it('returns false for a non-number', () => {
		expect(isNonNegativeInteger('1')).toBe(false);
		expect(isNonNegativeInteger('0')).toBe(false);
		expect(isNonNegativeInteger(null)).toBe(false);
		expect(isNonNegativeInteger({})).toBe(false);
		expect(isNonNegativeInteger([])).toBe(false);
	});
});
