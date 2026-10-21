import { describe, it } from 'node:test';

import isStandardSyntaxRule from '../isStandardSyntaxRule.mjs';
import less from 'postcss-less';
import postcss from 'postcss';

const node = (code, parser = postcss) => parser.parse(code).first;
const lessNode = (code) => node(code, less);

describe('isStandardSyntaxRule', () => {
	it('type', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('a {}')));
	});
	it('when type selector before selector', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('when a {}')));
	});
	it('when type selector after selector', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('a when {}')));
	});
	it('pseudo-class', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('a:last-child {}')));
	});
	it('pseudo-class not', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('a:not(.a) {}')));
	});
	it('pseudo-element', (t) => {
		t.assert.ok(isStandardSyntaxRule(node('a::after {}')));
	});
	it('custom-selector', (t) => {
		t.assert.ok(isStandardSyntaxRule(node(':--custom-selector {}')));
	});
	it('compound custom-selectors', (t) => {
		t.assert.ok(isStandardSyntaxRule(node(':--custom-selector:--custom-selector {}')));
	});
	it('custom-property-set', (t) => {
		t.assert.ok(!isStandardSyntaxRule(node('--custom-property-set: {}')));
	});
	it('scss nested properties', (t) => {
		t.assert.ok(!isStandardSyntaxRule(node('foo: {};')));
	});
	it('less class parametric mixin', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name(@var) {}')));
	});
	it('non-outputting parametric Less class mixin definition', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name() {}')));
	});
	it('non-outputting Less class mixin definition', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name(@a, @b) {}')));
	});
	it('non-outputting parametric Less class mixin definition ending in number', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name3(@a, @b) {}')));
	});
	it('non-outputting Less ID mixin definition', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('#mixin-name() {}')));
	});
	it('less mixin', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.box-shadow(@style, @c) when (iscolor(@c)) {}')));
	});
	it('less extend', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('&:extend(.inline) {}')));
	});
	it('less detached rulesets', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('@foo: {};')));
	});
	it('less guarded namespaces', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('#namespace when (@mode=huge) {}')));
	});
	it('less parametric mixins', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin (@variable: 5) {}')));
	});
	it('mixin guards', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.mixin (@variable) when (@variable = 10px) {}')));
	});
	it('css guards', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo() when (@variable = true) {}')));
	});
	it('css guards without spaces', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo()when(@variable = true) {}')));
	});
	it('css guards with multiple spaces', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo()   when   (@variable = true) {}')));
	});
	it('css guards with newlines', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo()\nwhen\n(@variable = true) {}')));
	});
	it('css guards with CRLF', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo()\r\nwhen\r\n(@variable = true) {}')));
	});
	it('css guards with parenthesis', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo() when (default()) {}')));
	});
	it('css guards with not', (t) => {
		t.assert.ok(!isStandardSyntaxRule(lessNode('.foo() when not (@variable = true) {}')));
	});
});
