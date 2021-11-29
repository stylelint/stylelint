const getWordEndIndex = require('../getWordEndIndex');

describe('getWordEndIndex', () => {
	it('should return the exclusive index of the end of the word', () => {
		const text = 'hello world';
		const index = 6;
		const expected = 11;
		const actual = getWordEndIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the exclusive index of the end of the word when the word contains a hyphen', () => {
		const text = 'hello-world';
		const index = 0;
		const expected = 11;
		const actual = getWordEndIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the given index plus one when a word is not found', () => {
		const text = 'hello world';
		const index = 5;
		const expected = 6;
		const actual = getWordEndIndex(text, index);

		expect(actual).toBe(expected);
	});
});
