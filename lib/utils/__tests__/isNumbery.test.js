'use strict';

const isNumbery = require('../isNumbery');

it('isNumbery', () => {
	expect(isNumbery('1')).toBeTruthy();
	expect(isNumbery('21 ')).toBeTruthy();
	expect(isNumbery(' 212')).toBeTruthy();
	expect(isNumbery('232 ')).toBeTruthy();
	expect(isNumbery('')).toBeFalsy();
	expect(isNumbery(' ')).toBeFalsy();
	expect(isNumbery('a')).toBeFalsy();
});
