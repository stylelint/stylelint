import { describe, it } from 'node:test';

import { atKeywords, nestingSupportedAtKeywords } from '../atKeywords.mjs';

describe('atKeywords', () => {
	it('nestingSupportedAtKeywords is a subset of all atKeywords', (t) => {
		for (const keyword of nestingSupportedAtKeywords) {
			t.assert.ok(atKeywords.has(keyword));
		}
	});
});
