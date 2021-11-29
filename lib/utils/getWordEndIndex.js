const wordEndRegex = /^[\w-]+\b/;

/**
 * Given a string and an index, returns the exclusive end index of the word at
 * the given index. Words are defined as a sequence of characters that match
 * the regular expression word character class or a hyphen. If a word is not
 * found at the given index, returns an end index of the given index plus one.
 *
 * @example
 * ```js
 * getWordEndIndex('foo bar', 4); // => 7
 * getWordEndIndex('foo bar', 3); // => 4
 * getWordEndIndex('max-width: 100px;', 0); // => 9
 * ```
 * @param {string} str The string to search.
 * @param {number} index The index of the word.
 */
module.exports = function getWordEndIndex(str, index) {
	const match = wordEndRegex.exec(str.slice(index));

	return match ? index + match[0].length : index + 1;
};
