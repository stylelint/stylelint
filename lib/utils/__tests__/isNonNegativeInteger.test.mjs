import { describe, it } from 'node:test';

import isNonNegativeInteger from '../isNonNegativeInteger.mjs';

describe('isNonNegativeInteger', () => {
	it('returns true', (t) => {
		t.assert.strictEqual(isNonNegativeInteger(0), true);
		t.assert.strictEqual(isNonNegativeInteger(1), true);
	});

	it('returns false', (t) => {
		t.assert.strictEqual(isNonNegativeInteger(-1), false);
		t.assert.strictEqual(isNonNegativeInteger(-0.1), false);
		t.assert.strictEqual(isNonNegativeInteger(0.1), false);
		t.assert.strictEqual(isNonNegativeInteger(Number.NaN), false);
	});

	it('returns false for a non-number', (t) => {
		t.assert.strictEqual(isNonNegativeInteger('1'), false);
		t.assert.strictEqual(isNonNegativeInteger('0'), false);
		t.assert.strictEqual(isNonNegativeInteger(null), false);
		t.assert.strictEqual(isNonNegativeInteger({}), false);
		t.assert.strictEqual(isNonNegativeInteger([]), false);
	});
});
