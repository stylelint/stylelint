import { describe, it } from 'node:test';

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
	it('returns true when a boolean value is specified', (t) => {
		t.assert.strictEqual(isBoolean(true), true);
	});

	it('returns true when a Boolean object is specified', (t) => {
		t.assert.strictEqual(isBoolean(new Boolean(true)), true);
	});

	it('returns false when a boolean value is not specified', (t) => {
		t.assert.strictEqual(isBoolean(null), false);
	});
});

describe('isFunction()', () => {
	it('returns true when a function value is specified', (t) => {
		t.assert.strictEqual(
			isFunction(() => 1),
			true,
		);
	});

	it('returns true when a Function object is specified', (t) => {
		t.assert.strictEqual(isFunction(new Function()), true);
	});

	it('returns false when a function value is specified', (t) => {
		t.assert.strictEqual(isFunction(null), false);
	});
});

describe('isNullish()', () => {
	it('returns true when null is specified', (t) => {
		t.assert.strictEqual(isNullish(null), true);
	});

	it('returns true when undefined is specified', (t) => {
		t.assert.strictEqual(isNullish(undefined), true);
	});

	it('returns false when neither null nor undefined is specified', (t) => {
		t.assert.strictEqual(isNullish(''), false);
	});
});

describe('isNumber()', () => {
	it('returns true when a number value is specified', (t) => {
		t.assert.strictEqual(isNumber(1), true);
	});

	it('returns true when a Number object is specified', (t) => {
		t.assert.strictEqual(isNumber(new Number(1)), true);
	});

	it('returns false when a number value is not specified', (t) => {
		t.assert.strictEqual(isNumber(null), false);
	});
});

describe('isObject()', () => {
	it('returns true when an object is specified', (t) => {
		t.assert.strictEqual(isObject({}), true);
	});

	it('returns false when an object is not specified', (t) => {
		t.assert.strictEqual(isObject(null), false);
	});
});

describe('isRegExp()', () => {
	it('returns true when a regexp value is specified', (t) => {
		t.assert.strictEqual(isRegExp(/a/), true);
	});

	it('returns false when a regexp value is not specified', (t) => {
		t.assert.strictEqual(isRegExp(null), false);
	});
});

describe('isString()', () => {
	it('returns true when a string value is specified', (t) => {
		t.assert.strictEqual(isString(''), true);
	});

	it('returns true when a String object is specified', (t) => {
		t.assert.strictEqual(isString(new String('')), true);
	});

	it('returns false when a string value is not specified', (t) => {
		t.assert.strictEqual(isString(null), false);
	});
});

describe('isPlainObject()', () => {
	it('returns true when a plain object is specified', (t) => {
		t.assert.strictEqual(isPlainObject({}), true);
		t.assert.strictEqual(isPlainObject({ a: 1 }), true);
		t.assert.strictEqual(isPlainObject(Object.create(null)), true);
		t.assert.strictEqual(isPlainObject(new Object()), true);
	});

	it('returns false when a plain object is not specified', (t) => {
		t.assert.strictEqual(isPlainObject(null), false);
		t.assert.strictEqual(isPlainObject(undefined), false);
		t.assert.strictEqual(isPlainObject('string'), false);
		t.assert.strictEqual(isPlainObject(123), false);
		t.assert.strictEqual(isPlainObject(true), false);
		t.assert.strictEqual(isPlainObject([]), false);
		t.assert.strictEqual(isPlainObject(new Date()), false);
		t.assert.strictEqual(isPlainObject(/regex/), false);
		t.assert.strictEqual(isPlainObject(new Map()), false);
		t.assert.strictEqual(isPlainObject(new Set()), false);
		t.assert.strictEqual(
			isPlainObject(() => {}),
			false,
		);

		class Foo {}
		t.assert.strictEqual(isPlainObject(new Foo()), false);
	});
});
