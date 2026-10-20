import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import hash from '../hash.mjs';

describe('hash()', () => {
	it('returns the expected value', () => {
		assert.equal(hash('foo'), 'LCa0a2j_xo');
	});

	it('returns a 10-character string', () => {
		assert.equal(hash('foo').length, 10);
		assert.equal(hash('').length, 10);
		assert.equal(hash('a very long string that exceeds normal length').length, 10);
	});

	it('returns consistent results for the same input', () => {
		assert.equal(hash('foo'), hash('foo'));
	});

	it('returns different results for different inputs', () => {
		assert.notEqual(hash('foo'), hash('bar'));
	});
});
