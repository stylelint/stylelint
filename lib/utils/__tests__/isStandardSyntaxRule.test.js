'use strict';

const isStandardSyntaxRule = require('../isStandardSyntaxRule');
const less = require('postcss-less');
const postcss = require('postcss');

const node = (code, parser = postcss) => parser.parse(code).first;
const lessNode = (code) => node(code, less);

describe('isStandardSyntaxRule', () => {
	it('type', () => {
		expect(isStandardSyntaxRule(node('a {}'))).toBeTruthy();
	});
	it('when type selector before selector', () => {
		expect(isStandardSyntaxRule(node('when a {}'))).toBeTruthy();
	});
	it('when type selector after selector', () => {
		expect(isStandardSyntaxRule(node('a when {}'))).toBeTruthy();
	});
	it('pseudo-class', () => {
		expect(isStandardSyntaxRule(node('a:last-child {}'))).toBeTruthy();
	});
	it('pseudo-class not', () => {
		expect(isStandardSyntaxRule(node('a:not(.a) {}'))).toBeTruthy();
	});
	it('pseudo-element', () => {
		expect(isStandardSyntaxRule(node('a::after {}'))).toBeTruthy();
	});
	it('custom-selector', () => {
		expect(isStandardSyntaxRule(node(':--custom-selector {}'))).toBeTruthy();
	});
	it('compound custom-selectors', () => {
		expect(isStandardSyntaxRule(node(':--custom-selector:--custom-selector {}'))).toBeTruthy();
	});
	it('custom-property-set', () => {
		expect(isStandardSyntaxRule(node('--custom-property-set: {}'))).toBeFalsy();
	});
	it('Scss nested properties', () => {
		expect(isStandardSyntaxRule(node('foo: {};'))).toBeFalsy();
	});
	it('called Less class parametric mixin', () => {
		expect(isStandardSyntaxRule(lessNode('.mixin-name(@var);'))).toBeFalsy();
	});
	it('non-outputting parametric Less class mixin definition', () => {
		expect(isStandardSyntaxRule(lessNode('.mixin-name() {}'))).toBeFalsy();
	});
	it('non-outputting Less class mixin definition', () => {
		expect(isStandardSyntaxRule(lessNode('.mixin-name(@a, @b) {}'))).toBeFalsy();
	});
	it('non-outputting parametric Less class mixin definition ending in number', () => {
		expect(isStandardSyntaxRule(lessNode('.mixin-name3(@a, @b) {}'))).toBeFalsy();
	});
	it('non-outputting Less ID mixin definition', () => {
		expect(isStandardSyntaxRule(lessNode('#mixin-name() {}'))).toBeFalsy();
	});
	it('called Less ID mixin', () => {
		expect(isStandardSyntaxRule(lessNode('#mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (child)', () => {
		expect(isStandardSyntaxRule(lessNode('#namespace > .mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (descendant)', () => {
		expect(isStandardSyntaxRule(lessNode('#namespace .mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (compound)', () => {
		expect(isStandardSyntaxRule(lessNode('#namespace.mixin-name;'))).toBeFalsy();
	});
	it('less mixin', () => {
		expect(
			isStandardSyntaxRule(lessNode('.box-shadow(@style, @c) when (iscolor(@c)) {}')),
		).toBeFalsy();
	});
	it('less extend', () => {
		expect(isStandardSyntaxRule(lessNode('&:extend(.inline);'))).toBeFalsy();
	});
	it('less detached rulesets', () => {
		expect(isStandardSyntaxRule(lessNode('@foo: {};'))).toBeFalsy();
	});
	it('less guarded namespaces', () => {
		expect(isStandardSyntaxRule(lessNode('#namespace when (@mode=huge) {}'))).toBeFalsy();
	});
	it('mixin guards', () => {
		expect(
			isStandardSyntaxRule(lessNode('.mixin (@variable) when (@variable = 10px) {}')),
		).toBeFalsy();
	});
	it('css guards', () => {
		expect(isStandardSyntaxRule(lessNode('.foo() when (@variable = true) {}'))).toBeFalsy();
	});
	it('css guards without spaces', () => {
		expect(isStandardSyntaxRule(lessNode('.foo()when(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with multiple spaces', () => {
		expect(isStandardSyntaxRule(lessNode('.foo()   when   (@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with newlines', () => {
		expect(isStandardSyntaxRule(lessNode('.foo()\nwhen\n(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with CRLF', () => {
		expect(isStandardSyntaxRule(lessNode('.foo()\r\nwhen\r\n(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with parenthesis', () => {
		expect(isStandardSyntaxRule(lessNode('.foo() when (default()) {}'))).toBeFalsy();
	});
	it('css guards with not', () => {
		expect(isStandardSyntaxRule(lessNode('.foo() when not (@variable = true) {}'))).toBeFalsy();
	});
});
