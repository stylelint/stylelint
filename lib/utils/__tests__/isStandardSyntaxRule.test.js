'use strict';

const isStandardSyntaxRule = require('../isStandardSyntaxRule');
const less = require('postcss-less');
const postcss = require('postcss');

describe('isStandardSyntaxRule', () => {
	it('type', () => {
		expect(isStandardSyntaxRule(rule('a {}'))).toBeTruthy();
	});
	it('when type selector before selector', () => {
		expect(isStandardSyntaxRule(rule('when a {}'))).toBeTruthy();
	});
	it('when type selector after selector', () => {
		expect(isStandardSyntaxRule(rule('a when {}'))).toBeTruthy();
	});
	it('pseudo-class', () => {
		expect(isStandardSyntaxRule(rule('a:last-child {}'))).toBeTruthy();
	});
	it('pseudo-class not', () => {
		expect(isStandardSyntaxRule(rule('a:not(.a) {}'))).toBeTruthy();
	});
	it('pseudo-element', () => {
		expect(isStandardSyntaxRule(rule('a::after {}'))).toBeTruthy();
	});
	it('custom-selector', () => {
		expect(isStandardSyntaxRule(rule(':--custom-selector {}'))).toBeTruthy();
	});
	it('compound custom-selectors', () => {
		expect(isStandardSyntaxRule(rule(':--custom-selector:--custom-selector {}'))).toBeTruthy();
	});
	it('custom-property-set', () => {
		expect(isStandardSyntaxRule(rule('--custom-property-set: {}'))).toBeFalsy();
	});
	it('Scss nested properties', () => {
		expect(isStandardSyntaxRule(rule('foo: {};'))).toBeFalsy();
	});
	it('called Less class parametric mixin', () => {
		expect(isStandardSyntaxRule(lessRule('.mixin-name(@var);'))).toBeFalsy();
	});
	it('non-outputting parametric Less class mixin definition', () => {
		expect(isStandardSyntaxRule(lessRule('.mixin-name() {}'))).toBeFalsy();
	});
	it('non-outputting Less class mixin definition', () => {
		expect(isStandardSyntaxRule(lessRule('.mixin-name(@a, @b) {}'))).toBeFalsy();
	});
	it('non-outputting parametric Less class mixin definition ending in number', () => {
		expect(isStandardSyntaxRule(lessRule('.mixin-name3(@a, @b) {}'))).toBeFalsy();
	});
	it('non-outputting Less ID mixin definition', () => {
		expect(isStandardSyntaxRule(lessRule('#mixin-name() {}'))).toBeFalsy();
	});
	it('called Less ID mixin', () => {
		expect(isStandardSyntaxRule(lessRule('#mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (child)', () => {
		expect(isStandardSyntaxRule(lessRule('#namespace > .mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (descendant)', () => {
		expect(isStandardSyntaxRule(lessRule('#namespace .mixin-name;'))).toBeFalsy();
	});
	it('called namespaced Less mixin (compound)', () => {
		expect(isStandardSyntaxRule(lessRule('#namespace.mixin-name;'))).toBeFalsy();
	});
	it('less mixin', () => {
		expect(
			isStandardSyntaxRule(lessRule('.box-shadow(@style, @c) when (iscolor(@c)) {}')),
		).toBeFalsy();
	});
	it('less extend', () => {
		expect(isStandardSyntaxRule(lessRule('&:extend(.inline);'))).toBeFalsy();
	});
	it('less detached rulesets', () => {
		expect(isStandardSyntaxRule(lessRule('@foo: {};'))).toBeFalsy();
	});
	it('less guarded namespaces', () => {
		expect(isStandardSyntaxRule(lessRule('#namespace when (@mode=huge) {}'))).toBeFalsy();
	});
	it('mixin guards', () => {
		expect(
			isStandardSyntaxRule(lessRule('.mixin (@variable) when (@variable = 10px) {}')),
		).toBeFalsy();
	});
	it('css guards', () => {
		expect(isStandardSyntaxRule(lessRule('.foo() when (@variable = true) {}'))).toBeFalsy();
	});
	it('css guards without spaces', () => {
		expect(isStandardSyntaxRule(lessRule('.foo()when(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with multiple spaces', () => {
		expect(isStandardSyntaxRule(lessRule('.foo()   when   (@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with newlines', () => {
		expect(isStandardSyntaxRule(lessRule('.foo()\nwhen\n(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with CRLF', () => {
		expect(isStandardSyntaxRule(lessRule('.foo()\r\nwhen\r\n(@variable = true) {}'))).toBeFalsy();
	});
	it('css guards with parenthesis', () => {
		expect(isStandardSyntaxRule(lessRule('.foo() when (default()) {}'))).toBeFalsy();
	});
	it('css guards with not', () => {
		expect(isStandardSyntaxRule(lessRule('.foo() when not (@variable = true) {}'))).toBeFalsy();
	});
});

function rule(css, parser = postcss) {
	const list = [];

	parser.parse(css).walkRules((rule) => list.push(rule));

	return list[0];
}

function lessRule(css) {
	return rule(css, less);
}
