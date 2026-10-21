import { describe, it } from 'node:test';

import isStandardSyntaxValue from '../isStandardSyntaxValue.mjs';

describe('isStandardSyntaxValue', () => {
	it('keyword', (t) => {
		t.assert.ok(isStandardSyntaxValue('initial'));
	});
	it('svg keyword', (t) => {
		t.assert.ok(isStandardSyntaxValue('currentColor'));
	});
	it('dimension', (t) => {
		t.assert.ok(isStandardSyntaxValue('10px'));
	});
	it('angle', (t) => {
		t.assert.ok(isStandardSyntaxValue('45deg'));
	});
	it('scss var', (t) => {
		t.assert.ok(!isStandardSyntaxValue('$sass-variable'));
	});
	it('scss namespace', (t) => {
		t.assert.ok(!isStandardSyntaxValue('namespace.$sass-variable'));
	});
	it('negative scss var', (t) => {
		t.assert.ok(!isStandardSyntaxValue('-$sass-variable'));
	});
	it('positive scss var', (t) => {
		t.assert.ok(!isStandardSyntaxValue('+$sass-variable'));
	});
	it('less var', (t) => {
		t.assert.ok(!isStandardSyntaxValue('@less-variable'));
	});
	it('negative less var', (t) => {
		t.assert.ok(!isStandardSyntaxValue('-@less-variable'));
	});
	it('scss interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxValue('#{$var}'));
	});
	it('negative scss interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxValue('-#{$var}'));
	});
	it('less interpolation', (t) => {
		t.assert.ok(!isStandardSyntaxValue('@{var}'));
	});
	it('WebExtension replacement keyword', (t) => {
		t.assert.ok(!isStandardSyntaxValue('__MSG_@@bidi_dir__'));
	});
	it('negative WebExtension replacement keyword', (t) => {
		t.assert.ok(isStandardSyntaxValue('__msg_@@bidi_dir__'));
	});
});
