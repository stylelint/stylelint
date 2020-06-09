'use strict';

const isStandardSyntaxProperty = require('../isStandardSyntaxProperty');

describe('isStandardSyntaxProperty', () => {
	it('single word', () => {
		expect(isStandardSyntaxProperty('top')).toBeTruthy();
	});
	it('custom property', () => {
		expect(isStandardSyntaxProperty('--custom-property')).toBeTruthy();
	});
	it('hyphenated words', () => {
		expect(isStandardSyntaxProperty('border-top-left-radius')).toBeTruthy();
	});
	it('vendor prefix', () => {
		expect(isStandardSyntaxProperty('-webkit-appearance')).toBeTruthy();
	});
	it('sass variable', () => {
		expect(isStandardSyntaxProperty('$sass-variable')).toBeFalsy();
	});
	it('sass variable within namespace', () => {
		expect(isStandardSyntaxProperty('namespace.$sass-variable')).toBeFalsy();
	});
	it('sass interpolation', () => {
		expect(isStandardSyntaxProperty('#{$Attr}-color')).toBeFalsy();
	});
	it('less variable', () => {
		expect(isStandardSyntaxProperty('@{Attr}-color')).toBeFalsy();
	});
	it('less append property value with comma', () => {
		expect(isStandardSyntaxProperty('transform+')).toBeFalsy();
	});
	it('less append property value with space', () => {
		expect(isStandardSyntaxProperty('transform+_')).toBeFalsy();
	});
});
