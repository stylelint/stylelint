import { it } from 'node:test';

import isVariable from '../isVariable.mjs';

it('isVariable', (t) => {
	t.assert.ok(isVariable('var(--something)'));
	t.assert.ok(isVariable('vAr(--something)'));
	t.assert.ok(isVariable('VAR(--something)'));
	t.assert.ok(isVariable('var(  --something  )'));
	t.assert.ok(!isVariable('initial'));
	t.assert.ok(!isVariable('currentColor'));
	t.assert.ok(!isVariable('-webkit-appearance'));
	t.assert.ok(!isVariable('--custom-property'));
	t.assert.ok(!isVariable('$sass-variable'));
	t.assert.ok(!isVariable('@less-variable'));
});
