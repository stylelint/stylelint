const wordStartRegex = /\b[\w-]+$/;

/**
 * Given a string and an index, returns the inclusive start index of the word at
 * the given index. Words are defined as a sequence of characters that match
 * the regular expression word character class or a hyphen. If a word is not
 * found at the given index, returns a start index of the given index minus one.
 *
 * @example
 * ```js
 * getWordStartIndex('foo bar', 7); // => 4
 * getWordStartIndex('foo bar', 4); // => 3
 * getWordStartIndex('max-width: 100px;', 9); // => 0
 * ```
 * @param {string} str The string to search.
 * @param {number} endIndex The exclusive end index of the word.
 */
module.exports = function getWordStartIndex(str, endIndex) {
	const match = wordStartRegex.exec(str.slice(0, endIndex));

	return match ? endIndex - match[0].length : endIndex - 1;
};
