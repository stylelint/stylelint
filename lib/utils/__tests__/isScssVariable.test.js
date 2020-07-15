'use strict';

const isScssVariable = require('../isScssVariable');

describe('isScssVariable', () => {
	it('sass variable', () => {
		expect(isScssVariable('$sass-variable')).toBeTruthy();
	});
	it('sass variable within namespace', () => {
		expect(isScssVariable('namespace.$sass-variable')).toBeTruthy();
	});
	it('sass interpolation', () => {
		expect(isScssVariable('#{$Attr}-color')).toBeFalsy();
	});
	it('single word property', () => {
		expect(isScssVariable('top')).toBeFalsy();
	});
	it('hyphenated property', () => {
		expect(isScssVariable('border-top-left-radius')).toBeFalsy();
	});
	it('property with vendor prefix', () => {
		expect(isScssVariable('-webkit-appearance')).toBeFalsy();
	});
	it('custom property', () => {
		expect(isScssVariable('--custom-property')).toBeFalsy();
	});
	it('less variable', () => {
		expect(isScssVariable('@var')).toBeFalsy();
	});
	it('less append property value with comma', () => {
		expect(isScssVariable('transform+')).toBeFalsy();
	});
	it('less append property value with space', () => {
		expect(isScssVariable('transform+_')).toBeFalsy();
	});
});
