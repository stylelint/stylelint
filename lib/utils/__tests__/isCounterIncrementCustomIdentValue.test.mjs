import { it } from 'node:test';

import isCounterIncrementCustomIdentValue from '../isCounterIncrementCustomIdentValue.mjs';

it('isCustomIdents', (t) => {
	t.assert.ok(isCounterIncrementCustomIdentValue('counter'));
	t.assert.ok(isCounterIncrementCustomIdentValue('cOuNtEr'));
	t.assert.ok(isCounterIncrementCustomIdentValue('COUNTER'));
	t.assert.ok(isCounterIncrementCustomIdentValue('counter-name'));
	t.assert.ok(isCounterIncrementCustomIdentValue('counter1'));
	t.assert.ok(isCounterIncrementCustomIdentValue('counter2'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('none'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('inherit'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('initial'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('unset'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('-1'));
	t.assert.ok(!isCounterIncrementCustomIdentValue('1'));
});
