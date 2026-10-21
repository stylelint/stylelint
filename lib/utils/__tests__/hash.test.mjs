import { describe, it } from 'node:test';

import hash from '../hash.mjs';

describe('hash()', () => {
	it('returns the expected value', (t) => {
		t.assert.strictEqual(hash('foo'), 'LCa0a2j_xo');
	});

	it('returns a 10-character string', (t) => {
		t.assert.strictEqual(hash('foo').length, 10);
		t.assert.strictEqual(hash('').length, 10);
		t.assert.strictEqual(hash('a very long string that exceeds normal length').length, 10);
	});

	it('returns consistent results for the same input', (t) => {
		t.assert.strictEqual(hash('foo'), hash('foo'));
	});

	it('returns different results for different inputs', (t) => {
		t.assert.notStrictEqual(hash('foo'), hash('bar'));
	});
});
