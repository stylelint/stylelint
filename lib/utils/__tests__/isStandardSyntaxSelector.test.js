'use strict';

const isStandardSyntaxSelector = require('../isStandardSyntaxSelector');

describe('isStandardSyntaxSelector', () => {
	it('type', () => {
		expect(isStandardSyntaxSelector('a')).toBeTruthy();
	});
	it('class', () => {
		expect(isStandardSyntaxSelector('.a')).toBeTruthy();
	});
	it('attribute', () => {
		expect(isStandardSyntaxSelector('[a=a]')).toBeTruthy();
	});
	it('universal', () => {
		expect(isStandardSyntaxSelector('*')).toBeTruthy();
	});
	it('pseudo-class', () => {
		expect(isStandardSyntaxSelector('a:last-child')).toBeTruthy();
	});
	it('pseudo-class with function', () => {
		expect(isStandardSyntaxSelector('a:not(.b)')).toBeTruthy();
	});
	it('pseudo-element', () => {
		expect(isStandardSyntaxSelector('a::after')).toBeTruthy();
	});
	it('compound', () => {
		expect(isStandardSyntaxSelector('a.b')).toBeTruthy();
	});
	it('complex', () => {
		expect(isStandardSyntaxSelector('a > b')).toBeTruthy();
	});
	it('list', () => {
		expect(isStandardSyntaxSelector('a, b')).toBeTruthy();
	});
	it('SCSS interpolation (id)', () => {
		expect(isStandardSyntaxSelector('#{50% - $n}')).toBeFalsy();
	});
	it('SCSS interpolation (class)', () => {
		expect(isStandardSyntaxSelector('.n-#{$n}')).toBeFalsy();
	});
	it('SCSS interpolation (pseudo)', () => {
		expect(isStandardSyntaxSelector(':n-#{$n}')).toBeFalsy();
	});
	it('Less interpolation', () => {
		expect(isStandardSyntaxSelector('.n-@{n}')).toBeFalsy();
	});
	it('Less extend', () => {
		expect(isStandardSyntaxSelector('.a:extend(.a)')).toBeFalsy();
	});
	it('Less extend `all`', () => {
		expect(isStandardSyntaxSelector('.a:extend(.a all)')).toBeFalsy();
	});
	it('Less extend inside ruleset', () => {
		expect(isStandardSyntaxSelector('a { &:extend(.a all) }')).toBeFalsy();
	});
	it('SCSS placeholder', () => {
		expect(isStandardSyntaxSelector('%foo')).toBeFalsy();
	});
	it('Less mixin with resolved nested selectors', () => {
		expect(isStandardSyntaxSelector('.foo().bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo(@a, @b).bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo()#bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo()#bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo() bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo() + bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo() > bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo() ~ bar')).toBeFalsy();
		expect(isStandardSyntaxSelector('.foo()[bar]')).toBeFalsy();
		expect(isStandardSyntaxSelector(".foo()[bar='baz']")).toBeFalsy();
	});

	it('ERB templates', () => {
		// E. g. like in https://github.com/stylelint/stylelint/issues/4489
		expect(isStandardSyntaxSelector('<% COLORS.each do |color| %>\na')).toBe(false);
		expect(isStandardSyntaxSelector('<% eng %>\na')).toBe(false);
	});
});
