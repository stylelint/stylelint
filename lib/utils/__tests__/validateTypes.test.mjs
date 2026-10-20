import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
	isBoolean,
	isFunction,
	isNullish,
	isNumber,
	isObject,
	isPlainObject,
	isRegExp,
	isString,
} from '../validateTypes.mjs';

describe('isBoolean()', () => {
	it('returns true when a boolean value is specified', () => {
		assert.equal(isBoolean(true), true);
	});

	it('returns true when a Boolean object is specified', () => {
		assert.equal(isBoolean(new Boolean(true)), true);
	});

	it('returns false when a boolean value is not specified', () => {
		assert.equal(isBoolean(null), false);
	});
});

describe('isFunction()', () => {
	it('returns true when a function value is specified', () => {
		assert.equal(
			isFunction(() => 1),
			true,
		);
	});

	it('returns true when a Function object is specified', () => {
		assert.equal(isFunction(new Function()), true);
	});

	it('returns false when a function value is specified', () => {
		assert.equal(isFunction(null), false);
	});
});

describe('isNullish()', () => {
	it('returns true when null is specified', () => {
		assert.equal(isNullish(null), true);
	});

	it('returns true when undefined is specified', () => {
		assert.equal(isNullish(undefined), true);
	});

	it('returns false when neither null nor undefined is specified', () => {
		assert.equal(isNullish(''), false);
	});
});

describe('isNumber()', () => {
	it('returns true when a number value is specified', () => {
		assert.equal(isNumber(1), true);
	});

	it('returns true when a Number object is specified', () => {
		assert.equal(isNumber(new Number(1)), true);
	});

	it('returns false when a number value is not specified', () => {
		assert.equal(isNumber(null), false);
	});
});

describe('isObject()', () => {
	it('returns true when an object is specified', () => {
		assert.equal(isObject({}), true);
	});

	it('returns false when an object is not specified', () => {
		assert.equal(isObject(null), false);
	});
});

describe('isRegExp()', () => {
	it('returns true when a regexp value is specified', () => {
		assert.equal(isRegExp(/a/), true);
	});

	it('returns false when a regexp value is not specified', () => {
		assert.equal(isRegExp(null), false);
	});
});

describe('isString()', () => {
	it('returns true when a string value is specified', () => {
		assert.equal(isString(''), true);
	});

	it('returns true when a String object is specified', () => {
		assert.equal(isString(new String('')), true);
	});

	it('returns false when a string value is not specified', () => {
		assert.equal(isString(null), false);
	});
});

describe('isPlainObject()', () => {
	it('returns true when a plain object is specified', () => {
		assert.equal(isPlainObject({}), true);
		assert.equal(isPlainObject({ a: 1 }), true);
		assert.equal(isPlainObject(Object.create(null)), true);
		assert.equal(isPlainObject(new Object()), true);
	});

	it('returns false when a plain object is not specified', () => {
		assert.equal(isPlainObject(null), false);
		assert.equal(isPlainObject(undefined), false);
		assert.equal(isPlainObject('string'), false);
		assert.equal(isPlainObject(123), false);
		assert.equal(isPlainObject(true), false);
		assert.equal(isPlainObject([]), false);
		assert.equal(isPlainObject(new Date()), false);
		assert.equal(isPlainObject(/regex/), false);
		assert.equal(isPlainObject(new Map()), false);
		assert.equal(isPlainObject(new Set()), false);
		assert.equal(
			isPlainObject(() => {}),
			false,
		);

		class Foo {}
		assert.equal(isPlainObject(new Foo()), false);
	});
});
