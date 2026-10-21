import { describe, it } from 'node:test';

import formatReason from '../formatReason.mjs';

describe('formatReason', () => {
	it('lowercases the first character', (t) => {
		t.assert.strictEqual(formatReason('Unexpected input'), 'unexpected input');
	});

	it('drops a trailing period', (t) => {
		t.assert.strictEqual(
			formatReason('Unexpected addition of a dimension with a number.'),
			'unexpected addition of a dimension with a number',
		);
	});

	it('keeps a leading quote', (t) => {
		t.assert.strictEqual(formatReason('")" is expected'), '")" is expected');
	});
});
