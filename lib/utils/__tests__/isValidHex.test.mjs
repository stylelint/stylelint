import assert from 'node:assert/strict';
import { it } from 'node:test';

import isValidHex from '../isValidHex.mjs';

it('isValidHex', () => {
	assert.ok(isValidHex('#333'));
	assert.ok(isValidHex('#a3b'));
	assert.ok(isValidHex('#333a'));
	assert.ok(isValidHex('#333afe'));
	assert.ok(isValidHex('#333afeaa'));
	assert.ok(!isValidHex('a'));
	assert.ok(!isValidHex('aaa'));
	assert.ok(!isValidHex('$aaa'));
	assert.ok(!isValidHex('@aaa'));
	assert.ok(!isValidHex('var(aaa)'));
	assert.ok(!isValidHex('#z1'));
	assert.ok(!isValidHex('#00000'));
	assert.ok(!isValidHex('#000000000'));
	assert.ok(!isValidHex('#33z'));
});
