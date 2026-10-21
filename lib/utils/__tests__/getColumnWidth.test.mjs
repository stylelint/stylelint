import { describe, it } from 'node:test';

import getColumnWidth from '../getColumnWidth.mjs';

describe('getColumnWidth', () => {
	it('returns the width of the widest cell', (t) => {
		t.assert.strictEqual(
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

	it('measures by terminal columns', (t) => {
		t.assert.strictEqual(getColumnWidth([{ a: 'ab' }, { a: '简体' }], 'a'), 4);
	});

	it('is at least one', (t) => {
		t.assert.strictEqual(getColumnWidth([{ a: '' }], 'a'), 1);
		t.assert.strictEqual(getColumnWidth([], 'a'), 1);
	});
});
