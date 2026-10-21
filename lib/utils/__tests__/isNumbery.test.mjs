import { test } from 'node:test';

import isNumbery from '../isNumbery.mjs';

test('isNumbery', (t) => {
	t.assert.strictEqual(isNumbery('1'), true);
	t.assert.strictEqual(isNumbery('21 '), true);
	t.assert.strictEqual(isNumbery(' 212'), true);
	t.assert.strictEqual(isNumbery('232 '), true);
	t.assert.strictEqual(isNumbery(''), false);
	t.assert.strictEqual(isNumbery(' '), false);
	t.assert.strictEqual(isNumbery('a'), false);
	t.assert.strictEqual(isNumbery(0), true);
	t.assert.strictEqual(isNumbery(1), true);
	t.assert.strictEqual(isNumbery(-1), true);
	t.assert.strictEqual(isNumbery(0.1), true);
	t.assert.strictEqual(isNumbery(-0.1), true);
	t.assert.strictEqual(isNumbery(NaN), false);
	t.assert.strictEqual(isNumbery('NaN'), false);
});
