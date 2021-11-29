const getWhitespaceStartIndex = require('../getWhitespaceStartIndex');

describe('getWhitespaceStartIndex', () => {
	it('should return the inclusive index of the start of the whitespace', () => {
		const text = 'hello\r\n  world';
		const index = 9;
		const expected = 7;
		const actual = getWhitespaceStartIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the inclusive index of the start of the multiline whitespace', () => {
		const text = 'hello\r\n  world';
		const index = 9;
		const expected = 5;
		const actual = getWhitespaceStartIndex(text, index, true);

		expect(actual).toBe(expected);
	});

	it('should return the given index minus one when whitespace is not found', () => {
		const text = 'hello\r\n  world';
		const index = 5;
		const expected = 4;
		const actual = getWhitespaceStartIndex(text, index);

		expect(actual).toBe(expected);
	});
});
