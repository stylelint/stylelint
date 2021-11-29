const getWhitespaceEndIndex = require('../getWhitespaceEndIndex');

describe('getWhitespaceEndIndex', () => {
	it('should return the exclusive index of the end of the whitespace', () => {
		const text = 'hello  \r\nworld';
		const index = 5;
		const expected = 7;
		const actual = getWhitespaceEndIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the exclusive index of the end of the multiline whitespace', () => {
		const text = 'hello  \r\nworld';
		const index = 5;
		const expected = 9;
		const actual = getWhitespaceEndIndex(text, index, true);

		expect(actual).toBe(expected);
	});

	it('should return the given index plus one when whitespace is not found', () => {
		const text = 'hello  \r\nworld';
		const index = 9;
		const expected = 10;
		const actual = getWhitespaceEndIndex(text, index);

		expect(actual).toBe(expected);
	});
});
