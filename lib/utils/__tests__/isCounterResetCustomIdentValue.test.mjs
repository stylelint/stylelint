import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCounterResetCustomIdentValue from '../isCounterResetCustomIdentValue.mjs';

it('isCustomIdents', () => {
	assert.ok(isCounterResetCustomIdentValue('counter'));
	assert.ok(isCounterResetCustomIdentValue('cOuNtEr'));
	assert.ok(isCounterResetCustomIdentValue('COUNTER'));
	assert.ok(isCounterResetCustomIdentValue('counter-name'));
	assert.ok(isCounterResetCustomIdentValue('counter1'));
	assert.ok(isCounterResetCustomIdentValue('counter2'));
	assert.ok(!isCounterResetCustomIdentValue('none'));
	assert.ok(!isCounterResetCustomIdentValue('inherit'));
	assert.ok(!isCounterResetCustomIdentValue('initial'));
	assert.ok(!isCounterResetCustomIdentValue('unset'));
	assert.ok(!isCounterResetCustomIdentValue('-1'));
	assert.ok(!isCounterResetCustomIdentValue('1'));
});
