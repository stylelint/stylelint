import { it } from 'node:test';

import isValidHex from '../isValidHex.mjs';

it('isValidHex', (t) => {
	t.assert.ok(isValidHex('#333'));
	t.assert.ok(isValidHex('#a3b'));
	t.assert.ok(isValidHex('#333a'));
	t.assert.ok(isValidHex('#333afe'));
	t.assert.ok(isValidHex('#333afeaa'));
	t.assert.ok(!isValidHex('a'));
	t.assert.ok(!isValidHex('aaa'));
	t.assert.ok(!isValidHex('$aaa'));
	t.assert.ok(!isValidHex('@aaa'));
	t.assert.ok(!isValidHex('var(aaa)'));
	t.assert.ok(!isValidHex('#z1'));
	t.assert.ok(!isValidHex('#00000'));
	t.assert.ok(!isValidHex('#000000000'));
	t.assert.ok(!isValidHex('#33z'));
});
