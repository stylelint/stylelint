import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxRule from '../isStandardSyntaxRule.mjs';
import less from 'postcss-less';
import postcss from 'postcss';

const node = (code, parser = postcss) => parser.parse(code).first;
const lessNode = (code) => node(code, less);

describe('isStandardSyntaxRule', () => {
	it('type', () => {
		assert.ok(isStandardSyntaxRule(node('a {}')));
	});
	it('when type selector before selector', () => {
		assert.ok(isStandardSyntaxRule(node('when a {}')));
	});
	it('when type selector after selector', () => {
		assert.ok(isStandardSyntaxRule(node('a when {}')));
	});
	it('pseudo-class', () => {
		assert.ok(isStandardSyntaxRule(node('a:last-child {}')));
	});
	it('pseudo-class not', () => {
		assert.ok(isStandardSyntaxRule(node('a:not(.a) {}')));
	});
	it('pseudo-element', () => {
		assert.ok(isStandardSyntaxRule(node('a::after {}')));
	});
	it('custom-selector', () => {
		assert.ok(isStandardSyntaxRule(node(':--custom-selector {}')));
	});
	it('compound custom-selectors', () => {
		assert.ok(isStandardSyntaxRule(node(':--custom-selector:--custom-selector {}')));
	});
	it('custom-property-set', () => {
		assert.ok(!isStandardSyntaxRule(node('--custom-property-set: {}')));
	});
	it('scss nested properties', () => {
		assert.ok(!isStandardSyntaxRule(node('foo: {};')));
	});
	it('less class parametric mixin', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name(@var) {}')));
	});
	it('non-outputting parametric Less class mixin definition', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name() {}')));
	});
	it('non-outputting Less class mixin definition', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name(@a, @b) {}')));
	});
	it('non-outputting parametric Less class mixin definition ending in number', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin-name3(@a, @b) {}')));
	});
	it('non-outputting Less ID mixin definition', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('#mixin-name() {}')));
	});
	it('less mixin', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.box-shadow(@style, @c) when (iscolor(@c)) {}')));
	});
	it('less extend', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('&:extend(.inline) {}')));
	});
	it('less detached rulesets', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('@foo: {};')));
	});
	it('less guarded namespaces', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('#namespace when (@mode=huge) {}')));
	});
	it('less parametric mixins', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin (@variable: 5) {}')));
	});
	it('mixin guards', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.mixin (@variable) when (@variable = 10px) {}')));
	});
	it('css guards', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo() when (@variable = true) {}')));
	});
	it('css guards without spaces', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo()when(@variable = true) {}')));
	});
	it('css guards with multiple spaces', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo()   when   (@variable = true) {}')));
	});
	it('css guards with newlines', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo()\nwhen\n(@variable = true) {}')));
	});
	it('css guards with CRLF', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo()\r\nwhen\r\n(@variable = true) {}')));
	});
	it('css guards with parenthesis', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo() when (default()) {}')));
	});
	it('css guards with not', () => {
		assert.ok(!isStandardSyntaxRule(lessNode('.foo() when not (@variable = true) {}')));
	});
});
