'use strict';

const isValidFontSize = require('../isValidFontSize');

it('isValidFontSize', () => {
	expect(isValidFontSize('10px')).toBeTruthy();
	expect(isValidFontSize('20%')).toBeTruthy();
	expect(isValidFontSize('20')).toBeFalsy();
	expect(isValidFontSize('small')).toBeTruthy();
	expect(isValidFontSize('smaller')).toBeTruthy();
	expect(isValidFontSize('smallest')).toBeFalsy();
	expect(isValidFontSize(null)).toBeFalsy();
});
