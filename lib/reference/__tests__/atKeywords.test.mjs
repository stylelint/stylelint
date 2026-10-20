import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { atKeywords, nestingSupportedAtKeywords } from '../atKeywords.mjs';

describe('atKeywords', () => {
	it('nestingSupportedAtKeywords is a subset of all atKeywords', () => {
		for (const keyword of nestingSupportedAtKeywords) {
			assert.ok(atKeywords.has(keyword));
		}
	});
});
