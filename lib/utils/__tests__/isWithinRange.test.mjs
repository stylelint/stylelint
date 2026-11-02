import { describe, test } from 'node:test';

import isWithinRange from '../isWithinRange.mjs';

describe('isWithinRange', () => {
	test('is true for a range inside', (t) => {
		t.assert.strictEqual(isWithinRange({ start: 2, end: 4 }, 1, 5), true);
	});

	test('is true for a range equal to the bounds', (t) => {
		t.assert.strictEqual(isWithinRange({ start: 1, end: 5 }, 1, 5), true);
	});

	test('is false for a range starting before', (t) => {
		t.assert.strictEqual(isWithinRange({ start: 0, end: 4 }, 1, 5), false);
	});

	test('is false for a range ending after', (t) => {
		t.assert.strictEqual(isWithinRange({ start: 2, end: 6 }, 1, 5), false);
	});

	test('is false for a range outside', (t) => {
		t.assert.strictEqual(isWithinRange({ start: 6, end: 8 }, 1, 5), false);
	});
});
