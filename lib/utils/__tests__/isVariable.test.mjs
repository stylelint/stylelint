import assert from 'node:assert/strict';
import { it } from 'node:test';

import isVariable from '../isVariable.mjs';

it('isVariable', () => {
	assert.ok(isVariable('var(--something)'));
	assert.ok(isVariable('vAr(--something)'));
	assert.ok(isVariable('VAR(--something)'));
	assert.ok(isVariable('var(  --something  )'));
	assert.ok(!isVariable('initial'));
	assert.ok(!isVariable('currentColor'));
	assert.ok(!isVariable('-webkit-appearance'));
	assert.ok(!isVariable('--custom-property'));
	assert.ok(!isVariable('$sass-variable'));
	assert.ok(!isVariable('@less-variable'));
});
