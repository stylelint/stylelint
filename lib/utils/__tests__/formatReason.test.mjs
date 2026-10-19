import formatReason from '../formatReason.mjs';

describe('formatReason', () => {
	it('lowercases the first character', () => {
		expect(formatReason('Unexpected input')).toBe('unexpected input');
	});

	it('drops a trailing period', () => {
		expect(formatReason('Unexpected addition of a dimension with a number.')).toBe(
			'unexpected addition of a dimension with a number',
		);
	});

	it('keeps a leading quote', () => {
		expect(formatReason('")" is expected')).toBe('")" is expected');
	});
});
