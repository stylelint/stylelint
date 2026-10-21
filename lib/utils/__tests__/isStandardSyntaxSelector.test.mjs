import { describe, it } from 'node:test';

import isStandardSyntaxSelector from '../isStandardSyntaxSelector.mjs';

describe('isStandardSyntaxSelector', () => {
	it('type', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a'));
	});
	it('class', (t) => {
		t.assert.ok(isStandardSyntaxSelector('.a'));
	});
	it('attribute', (t) => {
		t.assert.ok(isStandardSyntaxSelector('[a=a]'));
	});
	it('universal', (t) => {
		t.assert.ok(isStandardSyntaxSelector('*'));
	});
	it('pseudo-class', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a:last-child'));
	});
	it('pseudo-class with function', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a:not(.b)'));
	});
	it('pseudo-element', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a::after'));
	});
	it('compound', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a.b'));
	});
	it('complex', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a > b'));
	});
	it('list', (t) => {
		t.assert.ok(isStandardSyntaxSelector('a, b'));
	});
	it('SCSS interpolation (id)', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('#{50% - $n}'));
	});
	it('SCSS interpolation (class)', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.n-#{$n}'));
	});
	it('SCSS interpolation (pseudo)', (t) => {
		t.assert.ok(!isStandardSyntaxSelector(':n-#{$n}'));
	});
	it('SCSS placeholder', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('%foo'));
	});
	it('SCSS nested properties', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.a { .b }'));
		t.assert.ok(!isStandardSyntaxSelector('.a { &:hover }'));
	});
	it('Less interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.n-@{n}'));
	});
	it('Less extend', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.a:extend(.a)'));
	});
	it('Less extend `all`', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.a:extend(.a all)'));
	});
	it('Less extend inside ruleset', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('a { &:extend(.a all) }'));
	});
	it('Less mixin', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.foo()'));
	});
	it('Less mixin with resolved nested selectors', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.foo().bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo(@a, @b).bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo()#bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo()#bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo() bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo() + bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo() > bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo() ~ bar'));
		t.assert.ok(!isStandardSyntaxSelector('.foo()[bar]'));
		t.assert.ok(!isStandardSyntaxSelector(".foo()[bar='baz']"));
	});
	it('Less parametric mixin', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('.foo(@a)'));
		t.assert.ok(!isStandardSyntaxSelector('.foo(@a: 5px)'));
	});
	it('SCSS or Less comments', (t) => {
		t.assert.ok(!isStandardSyntaxSelector('a\n// comment\nb'));
		t.assert.ok(!isStandardSyntaxSelector('a\n//comment\nb'));
	});
	it('ERB templates', (t) => {
		// E. g. like in https://github.com/stylelint/stylelint/issues/4489
		t.assert.strictEqual(isStandardSyntaxSelector('<% COLORS.each do |color| %>\na'), false);
		t.assert.strictEqual(isStandardSyntaxSelector('<% eng %>\na'), false);
	});
});
