import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxValue from '../isStandardSyntaxValue.mjs';

describe('isStandardSyntaxValue', () => {
	it('keyword', () => {
		assert.ok(isStandardSyntaxValue('initial'));
	});
	it('svg keyword', () => {
		assert.ok(isStandardSyntaxValue('currentColor'));
	});
	it('dimension', () => {
		assert.ok(isStandardSyntaxValue('10px'));
	});
	it('angle', () => {
		assert.ok(isStandardSyntaxValue('45deg'));
	});
	it('scss var', () => {
		assert.ok(!isStandardSyntaxValue('$sass-variable'));
	});
	it('scss namespace', () => {
		assert.ok(!isStandardSyntaxValue('namespace.$sass-variable'));
	});
	it('negative scss var', () => {
		assert.ok(!isStandardSyntaxValue('-$sass-variable'));
	});
	it('positive scss var', () => {
		assert.ok(!isStandardSyntaxValue('+$sass-variable'));
	});
	it('less var', () => {
		assert.ok(!isStandardSyntaxValue('@less-variable'));
	});
	it('negative less var', () => {
		assert.ok(!isStandardSyntaxValue('-@less-variable'));
	});
	it('scss interpolation', () => {
		assert.ok(!isStandardSyntaxValue('#{$var}'));
	});
	it('negative scss interpolation', () => {
		assert.ok(!isStandardSyntaxValue('-#{$var}'));
	});
	it('less interpolation', () => {
		assert.ok(!isStandardSyntaxValue('@{var}'));
	});
	it('WebExtension replacement keyword', () => {
		assert.ok(!isStandardSyntaxValue('__MSG_@@bidi_dir__'));
	});
	it('negative WebExtension replacement keyword', () => {
		assert.ok(isStandardSyntaxValue('__msg_@@bidi_dir__'));
	});
});
