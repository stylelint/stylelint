import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isScssVariable from '../isScssVariable.mjs';

describe('isScssVariable', () => {
	it('sass variable', () => {
		assert.ok(isScssVariable('$sass-variable'));
	});
	it('sass variable within namespace', () => {
		assert.ok(isScssVariable('namespace.$sass-variable'));
	});
	it('sass interpolation', () => {
		assert.ok(!isScssVariable('#{$Attr}-color'));
	});
	it('single word property', () => {
		assert.ok(!isScssVariable('top'));
	});
	it('hyphenated property', () => {
		assert.ok(!isScssVariable('border-top-left-radius'));
	});
	it('property with vendor prefix', () => {
		assert.ok(!isScssVariable('-webkit-appearance'));
	});
	it('custom property', () => {
		assert.ok(!isScssVariable('--custom-property'));
	});
	it('less variable', () => {
		assert.ok(!isScssVariable('@var'));
	});
	it('less append property value with comma', () => {
		assert.ok(!isScssVariable('transform+'));
	});
	it('less append property value with space', () => {
		assert.ok(!isScssVariable('transform+_'));
	});
});
