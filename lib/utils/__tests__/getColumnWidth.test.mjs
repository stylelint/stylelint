import getColumnWidth from '../getColumnWidth.mjs';

describe('getColumnWidth', () => {
	it('returns the width of the widest cell', () => {
		expect(
			getColumnWidth(
				[
					{ a: 'ab', b: 'abcd' },
					{ a: 'abc', b: '' },
				],
				'a',
			),
		).toBe(3);
	});

	it('measures by terminal columns', () => {
		expect(getColumnWidth([{ a: 'ab' }, { a: '简体' }], 'a')).toBe(4);
	});

	it('is at least one', () => {
		expect(getColumnWidth([{ a: '' }], 'a')).toBe(1);
		expect(getColumnWidth([], 'a')).toBe(1);
	});
});
