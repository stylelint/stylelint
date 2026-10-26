import { describe, it } from 'node:test';

import isStandardSyntaxProperty from '../isStandardSyntaxProperty.mjs';

describe('isStandardSyntaxProperty', () => {
	it('single word', (t) => {
		t.assert.ok(isStandardSyntaxProperty('top'));
	});
	it('custom property', (t) => {
		t.assert.ok(isStandardSyntaxProperty('--custom-property'));
	});
	it('hyphenated words', (t) => {
		t.assert.ok(isStandardSyntaxProperty('border-top-left-radius'));
	});
	it('vendor prefix', (t) => {
		t.assert.ok(isStandardSyntaxProperty('-webkit-appearance'));
	});
	it('sass variable', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('$sass-variable'));
	});
	it('sass variable within namespace', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('namespace.$sass-variable'));
	});
	it('sass interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('#{$Attr}-color'));
	});
	it('less variable', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('@{Attr}-color'));
	});
	it('less append property value with comma', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('transform+'));
	});
	it('less append property value with space', (t) => {
		t.assert.ok(!isStandardSyntaxProperty('transform+_'));
	});
});
