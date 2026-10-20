import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isNonNegativeInteger from '../isNonNegativeInteger.mjs';

describe('isNonNegativeInteger', () => {
	it('returns true', () => {
		assert.equal(isNonNegativeInteger(0), true);
		assert.equal(isNonNegativeInteger(1), true);
	});

	it('returns false', () => {
		assert.equal(isNonNegativeInteger(-1), false);
		assert.equal(isNonNegativeInteger(-0.1), false);
		assert.equal(isNonNegativeInteger(0.1), false);
		assert.equal(isNonNegativeInteger(Number.NaN), false);
	});

	it('returns false for a non-number', () => {
		assert.equal(isNonNegativeInteger('1'), false);
		assert.equal(isNonNegativeInteger('0'), false);
		assert.equal(isNonNegativeInteger(null), false);
		assert.equal(isNonNegativeInteger({}), false);
		assert.equal(isNonNegativeInteger([]), false);
	});
});
