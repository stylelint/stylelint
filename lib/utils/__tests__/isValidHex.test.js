'use strict';

const isValidHex = require('../isValidHex');

it('isValidHex', () => {
	expect(isValidHex('#333')).toBeTruthy();
	expect(isValidHex('#a3b')).toBeTruthy();
	expect(isValidHex('#333a')).toBeTruthy();
	expect(isValidHex('#333afe')).toBeTruthy();
	expect(isValidHex('#333afeaa')).toBeTruthy();
	expect(isValidHex('a')).toBeFalsy();
	expect(isValidHex('aaa')).toBeFalsy();
	expect(isValidHex('$aaa')).toBeFalsy();
	expect(isValidHex('@aaa')).toBeFalsy();
	expect(isValidHex('var(aaa)')).toBeFalsy();
	expect(isValidHex('#z1')).toBeFalsy();
	expect(isValidHex('#00000')).toBeFalsy();
	expect(isValidHex('#000000000')).toBeFalsy();
	expect(isValidHex('#33z')).toBeFalsy();
});
