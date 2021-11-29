const whitespaceEndRegex = /^[^\S\r\n]+(?=$|[\S\r\n])/;
const multilineWhitespaceEndRegex = /^\s+(?=$|\S)/;

/**
 * Given a string and an index, returns the exclusive end index of the
 * whitespace at the given index. If whitespace is not found at the given index,
 * returns an end index of the given index plus one.
 *
 * @example
 * ```js
 * getWhitespaceEndIndex('foo\n  bar', 6); // => 4
 * getWhitespaceEndIndex('foo\n  bar', 4); // => 3
 * getWhitespaceEndIndex('foo\n  bar', 6, true); // => 3
 * ```
 * @param {string} str The string to search.
 * @param {number} index The start index of the whitespace.
 * @param {boolean} [multiline=false] Whether to consider line breaks as whitespace.
 */
module.exports = function getWhitespaceEndIndex(str, index, multiline = false) {
	const regex = multiline ? multilineWhitespaceEndRegex : whitespaceEndRegex;
	const match = regex.exec(str.slice(index));

	return match ? index + match[0].length : index + 1;
};
