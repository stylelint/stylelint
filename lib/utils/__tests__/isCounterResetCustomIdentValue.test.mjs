import { it } from 'node:test';

import isCounterResetCustomIdentValue from '../isCounterResetCustomIdentValue.mjs';

it('isCustomIdents', (t) => {
	t.assert.ok(isCounterResetCustomIdentValue('counter'));
	t.assert.ok(isCounterResetCustomIdentValue('cOuNtEr'));
	t.assert.ok(isCounterResetCustomIdentValue('COUNTER'));
	t.assert.ok(isCounterResetCustomIdentValue('counter-name'));
	t.assert.ok(isCounterResetCustomIdentValue('counter1'));
	t.assert.ok(isCounterResetCustomIdentValue('counter2'));
	t.assert.ok(!isCounterResetCustomIdentValue('none'));
	t.assert.ok(!isCounterResetCustomIdentValue('inherit'));
	t.assert.ok(!isCounterResetCustomIdentValue('initial'));
	t.assert.ok(!isCounterResetCustomIdentValue('unset'));
	t.assert.ok(!isCounterResetCustomIdentValue('-1'));
	t.assert.ok(!isCounterResetCustomIdentValue('1'));
});
