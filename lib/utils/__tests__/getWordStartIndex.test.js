const getWordStartIndex = require('../getWordStartIndex');

describe('getWordStartIndex', () => {
	it('should return the inclusive index of the start of the word', () => {
		const text = 'hello world';
		const index = 11;
		const expected = 6;
		const actual = getWordStartIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the inclusive index of the start of the word when the word contains a hyphen', () => {
		const text = 'hello-world';
		const index = 11;
		const expected = 0;
		const actual = getWordStartIndex(text, index);

		expect(actual).toBe(expected);
	});

	it('should return the given index minus one when a word is not found', () => {
		const text = 'hello world';
		const index = 6;
		const expected = 5;
		const actual = getWordStartIndex(text, index);

		expect(actual).toBe(expected);
	});
});
