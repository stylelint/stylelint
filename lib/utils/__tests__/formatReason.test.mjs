import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import formatReason from '../formatReason.mjs';

describe('formatReason', () => {
	it('lowercases the first character', () => {
		assert.equal(formatReason('Unexpected input'), 'unexpected input');
	});

	it('drops a trailing period', () => {
		assert.equal(
			formatReason('Unexpected addition of a dimension with a number.'),
			'unexpected addition of a dimension with a number',
		);
	});

	it('keeps a leading quote', () => {
		assert.equal(formatReason('")" is expected'), '")" is expected');
	});
});
