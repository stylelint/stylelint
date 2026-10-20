import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxSelector from '../isStandardSyntaxSelector.mjs';

describe('isStandardSyntaxSelector', () => {
	it('type', () => {
		assert.ok(isStandardSyntaxSelector('a'));
	});
	it('class', () => {
		assert.ok(isStandardSyntaxSelector('.a'));
	});
	it('attribute', () => {
		assert.ok(isStandardSyntaxSelector('[a=a]'));
	});
	it('universal', () => {
		assert.ok(isStandardSyntaxSelector('*'));
	});
	it('pseudo-class', () => {
		assert.ok(isStandardSyntaxSelector('a:last-child'));
	});
	it('pseudo-class with function', () => {
		assert.ok(isStandardSyntaxSelector('a:not(.b)'));
	});
	it('pseudo-element', () => {
		assert.ok(isStandardSyntaxSelector('a::after'));
	});
	it('compound', () => {
		assert.ok(isStandardSyntaxSelector('a.b'));
	});
	it('complex', () => {
		assert.ok(isStandardSyntaxSelector('a > b'));
	});
	it('list', () => {
		assert.ok(isStandardSyntaxSelector('a, b'));
	});
	it('SCSS interpolation (id)', () => {
		assert.ok(!isStandardSyntaxSelector('#{50% - $n}'));
	});
	it('SCSS interpolation (class)', () => {
		assert.ok(!isStandardSyntaxSelector('.n-#{$n}'));
	});
	it('SCSS interpolation (pseudo)', () => {
		assert.ok(!isStandardSyntaxSelector(':n-#{$n}'));
	});
	it('SCSS placeholder', () => {
		assert.ok(!isStandardSyntaxSelector('%foo'));
	});
	it('SCSS nested properties', () => {
		assert.ok(!isStandardSyntaxSelector('.a { .b }'));
		assert.ok(!isStandardSyntaxSelector('.a { &:hover }'));
	});
	it('Less interpolation', () => {
		assert.ok(!isStandardSyntaxSelector('.n-@{n}'));
	});
	it('Less extend', () => {
		assert.ok(!isStandardSyntaxSelector('.a:extend(.a)'));
	});
	it('Less extend `all`', () => {
		assert.ok(!isStandardSyntaxSelector('.a:extend(.a all)'));
	});
	it('Less extend inside ruleset', () => {
		assert.ok(!isStandardSyntaxSelector('a { &:extend(.a all) }'));
	});
	it('Less mixin', () => {
		assert.ok(!isStandardSyntaxSelector('.foo()'));
	});
	it('Less mixin with resolved nested selectors', () => {
		assert.ok(!isStandardSyntaxSelector('.foo().bar'));
		assert.ok(!isStandardSyntaxSelector('.foo(@a, @b).bar'));
		assert.ok(!isStandardSyntaxSelector('.foo()#bar'));
		assert.ok(!isStandardSyntaxSelector('.foo()#bar'));
		assert.ok(!isStandardSyntaxSelector('.foo() bar'));
		assert.ok(!isStandardSyntaxSelector('.foo() + bar'));
		assert.ok(!isStandardSyntaxSelector('.foo() > bar'));
		assert.ok(!isStandardSyntaxSelector('.foo() ~ bar'));
		assert.ok(!isStandardSyntaxSelector('.foo()[bar]'));
		assert.ok(!isStandardSyntaxSelector(".foo()[bar='baz']"));
	});
	it('Less parametric mixin', () => {
		assert.ok(!isStandardSyntaxSelector('.foo(@a)'));
		assert.ok(!isStandardSyntaxSelector('.foo(@a: 5px)'));
	});
	it('SCSS or Less comments', () => {
		assert.ok(!isStandardSyntaxSelector('a\n// comment\nb'));
		assert.ok(!isStandardSyntaxSelector('a\n//comment\nb'));
	});
	it('ERB templates', () => {
		// E. g. like in https://github.com/stylelint/stylelint/issues/4489
		assert.equal(isStandardSyntaxSelector('<% COLORS.each do |color| %>\na'), false);
		assert.equal(isStandardSyntaxSelector('<% eng %>\na'), false);
	});
});
