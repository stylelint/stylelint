'use strict';

const flattenArray = require('../flattenArray');

test('accept undefined', () => {
	expect(flattenArray(undefined)).toBeUndefined();
});

test('accept null', () => {
	expect(flattenArray(null)).toBeUndefined();
});

test('accept a single value', () => {
	expect(flattenArray(1)).toEqual([1]);
});

test('accept an array with a single value', () => {
	expect(flattenArray([1])).toEqual([1]);
});

test('accept an array with multiple values', () => {
	expect(flattenArray([1, 2])).toEqual([1, 2]);
});

test('accept an empty array', () => {
	expect(flattenArray([])).toEqual([]);
});
