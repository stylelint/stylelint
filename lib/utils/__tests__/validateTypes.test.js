'use strict';

const {
	isBoolean,
	isFunction,
	isNullish,
	isNumber,
	isRegExp,
	isString,
	isPlainObject,
} = require('../validateTypes');

describe('isBoolean()', () => {
	it('returns true when a boolean value is specified', () => {
		expect(isBoolean(true)).toBe(true);
	});

	it('returns true when a Boolean object is specified', () => {
		expect(isBoolean(new Boolean(true))).toBe(true);
	});

	it('returns false when a boolean value is not specified', () => {
		expect(isBoolean(null)).toBe(false);
	});
});

describe('isFunction()', () => {
	it('returns true when a function value is specified', () => {
		expect(isFunction(() => 1)).toBe(true);
	});

	it('returns true when a Function object is specified', () => {
		expect(isFunction(new Function())).toBe(true);
	});

	it('returns false when a function value is specified', () => {
		expect(isFunction(null)).toBe(false);
	});
});

describe('isNullish()', () => {
	it('returns true when null is specified', () => {
		expect(isNullish(null)).toBe(true);
	});

	it('returns true when undefined is specified', () => {
		expect(isNullish(undefined)).toBe(true);
	});

	it('returns false when neither null nor undefined is specified', () => {
		expect(isNullish('')).toBe(false);
	});
});

describe('isNumber()', () => {
	it('returns true when a number value is specified', () => {
		expect(isNumber(1)).toBe(true);
	});

	it('returns true when a Number object is specified', () => {
		expect(isNumber(new Number(1))).toBe(true);
	});

	it('returns false when a number value is not specified', () => {
		expect(isNumber(null)).toBe(false);
	});
});

describe('isRegExp()', () => {
	it('returns true when a regexp value is specified', () => {
		expect(isRegExp(/a/)).toBe(true);
	});

	it('returns false when a regexp value is not specified', () => {
		expect(isRegExp(null)).toBe(false);
	});
});

describe('isString()', () => {
	it('returns true when a string value is specified', () => {
		expect(isString('')).toBe(true);
	});

	it('returns true when a String object is specified', () => {
		expect(isString(new String(''))).toBe(true);
	});

	it('returns false when a string value is not specified', () => {
		expect(isString(null)).toBe(false);
	});
});

describe('isPlainObject()', () => {
	it('returns true when a plain object is specified', () => {
		expect(isPlainObject({})).toBe(true);
	});

	it('returns false when a plain object is not specified', () => {
		expect(isPlainObject(null)).toBe(false);
	});
});
