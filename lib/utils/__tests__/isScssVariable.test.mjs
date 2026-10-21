import { describe, it } from 'node:test';

import isScssVariable from '../isScssVariable.mjs';

describe('isScssVariable', () => {
	it('sass variable', (t) => {
		t.assert.ok(isScssVariable('$sass-variable'));
	});
	it('sass variable within namespace', (t) => {
		t.assert.ok(isScssVariable('namespace.$sass-variable'));
	});
	it('sass interpolation', (t) => {
		t.assert.ok(!isScssVariable('#{$Attr}-color'));
	});
	it('single word property', (t) => {
		t.assert.ok(!isScssVariable('top'));
	});
	it('hyphenated property', (t) => {
		t.assert.ok(!isScssVariable('border-top-left-radius'));
	});
	it('property with vendor prefix', (t) => {
		t.assert.ok(!isScssVariable('-webkit-appearance'));
	});
	it('custom property', (t) => {
		t.assert.ok(!isScssVariable('--custom-property'));
	});
	it('less variable', (t) => {
		t.assert.ok(!isScssVariable('@var'));
	});
	it('less append property value with comma', (t) => {
		t.assert.ok(!isScssVariable('transform+'));
	});
	it('less append property value with space', (t) => {
		t.assert.ok(!isScssVariable('transform+_'));
	});
});
