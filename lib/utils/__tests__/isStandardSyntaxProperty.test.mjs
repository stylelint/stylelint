import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxProperty from '../isStandardSyntaxProperty.mjs';

describe('isStandardSyntaxProperty', () => {
	it('single word', () => {
		assert.ok(isStandardSyntaxProperty('top'));
	});
	it('custom property', () => {
		assert.ok(isStandardSyntaxProperty('--custom-property'));
	});
	it('hyphenated words', () => {
		assert.ok(isStandardSyntaxProperty('border-top-left-radius'));
	});
	it('vendor prefix', () => {
		assert.ok(isStandardSyntaxProperty('-webkit-appearance'));
	});
	it('sass variable', () => {
		assert.ok(!isStandardSyntaxProperty('$sass-variable'));
	});
	it('sass variable within namespace', () => {
		assert.ok(!isStandardSyntaxProperty('namespace.$sass-variable'));
	});
	it('sass interpolation', () => {
		assert.ok(!isStandardSyntaxProperty('#{$Attr}-color'));
	});
	it('less variable', () => {
		assert.ok(!isStandardSyntaxProperty('@{Attr}-color'));
	});
	it('less append property value with comma', () => {
		assert.ok(!isStandardSyntaxProperty('transform+'));
	});
	it('less append property value with space', () => {
		assert.ok(!isStandardSyntaxProperty('transform+_'));
	});
});
