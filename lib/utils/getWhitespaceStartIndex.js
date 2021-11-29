const whitespaceStartRegex = /(?<=^|[\S\r\n])[^\S\r\n]+$/;
const multilineWhitespaceStartRegex = /(?<=^|\S)\s+$/;

/**
 * Given a string and an index, returns the inclusive start index of the
 * whitespace that ends at the given index. If whitespace is not found at the
 * given index, returns a start index of the given index minus one.
 *
 * @example
 * ```js
 * getWhitespaceStartIndex('foo\n  bar', 6); // => 4
 * getWhitespaceStartIndex('foo\n  bar', 4); // => 3
 * getWhitespaceStartIndex('foo\n  bar', 6, true); // => 3
 * ```
 * @param {string} str The string to search.
 * @param {number} endIndex The exclusive end index of the whitespace.
 * @param {boolean} [multiline=false] Whether to consider line breaks as whitespace.
 */
module.exports = function getWhitespaceStartIndex(str, endIndex, multiline = false) {
	const regex = multiline ? multilineWhitespaceStartRegex : whitespaceStartRegex;
	const match = regex.exec(str.slice(0, endIndex));

	return match ? endIndex - match[0].length : endIndex - 1;
};
