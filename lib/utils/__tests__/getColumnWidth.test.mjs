import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import getColumnWidth from '../getColumnWidth.mjs';

describe('getColumnWidth', () => {
	it('returns the width of the widest cell', () => {
		assert.equal(
			getColumnWidth(
				[
					{ a: 'ab', b: 'abcd' },
					{ a: 'abc', b: '' },
				],
				'a',
			),
			3,
		);
	});

	it('measures by terminal columns', () => {
		assert.equal(getColumnWidth([{ a: 'ab' }, { a: '简体' }], 'a'), 4);
	});

	it('is at least one', () => {
		assert.equal(getColumnWidth([{ a: '' }], 'a'), 1);
		assert.equal(getColumnWidth([], 'a'), 1);
	});
});
