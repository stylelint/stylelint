// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const HAS_EMPTY_LINE = /\n[\r\t ]*\n/;

/**
 * Check if a string contains at least one empty line
 *
 * @param {string | undefined} string
 * @returns {boolean}
 */
function hasEmptyLine(string) {
	if (string === '' || string === undefined) return false;

	return HAS_EMPTY_LINE.test(string);
}

module.exports = hasEmptyLine;
