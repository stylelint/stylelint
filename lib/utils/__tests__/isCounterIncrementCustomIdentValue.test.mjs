import assert from 'node:assert/strict';
import { it } from 'node:test';

import isCounterIncrementCustomIdentValue from '../isCounterIncrementCustomIdentValue.mjs';

it('isCustomIdents', () => {
	assert.ok(isCounterIncrementCustomIdentValue('counter'));
	assert.ok(isCounterIncrementCustomIdentValue('cOuNtEr'));
	assert.ok(isCounterIncrementCustomIdentValue('COUNTER'));
	assert.ok(isCounterIncrementCustomIdentValue('counter-name'));
	assert.ok(isCounterIncrementCustomIdentValue('counter1'));
	assert.ok(isCounterIncrementCustomIdentValue('counter2'));
	assert.ok(!isCounterIncrementCustomIdentValue('none'));
	assert.ok(!isCounterIncrementCustomIdentValue('inherit'));
	assert.ok(!isCounterIncrementCustomIdentValue('initial'));
	assert.ok(!isCounterIncrementCustomIdentValue('unset'));
	assert.ok(!isCounterIncrementCustomIdentValue('-1'));
	assert.ok(!isCounterIncrementCustomIdentValue('1'));
});
