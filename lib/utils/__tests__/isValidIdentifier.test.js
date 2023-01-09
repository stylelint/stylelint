'use strict';

const isValidIdentifier = require('../isValidIdentifier');

it('isValidIdentifier', () => {
	expect(isValidIdentifier('foo')).toBeTruthy();
	expect(isValidIdentifier('foo1')).toBeTruthy();
	expect(isValidIdentifier('1')).toBeFalsy();
	expect(isValidIdentifier('-1')).toBeFalsy();
	expect(isValidIdentifier('--foo')).toBeFalsy();
	expect(isValidIdentifier('has a space')).toBeFalsy();
	expect(isValidIdentifier(null)).toBeFalsy();
	expect(isValidIdentifier('')).toBeFalsy();
	expect(isValidIdentifier(' ')).toBeFalsy();
	expect(isValidIdentifier(' --foo')).toBeFalsy();
	expect(isValidIdentifier(' --foö')).toBeFalsy();
});
