'use strict';

const beforeBlockString = require('./beforeBlockString.cjs');
const hasBlock = require('./hasBlock.cjs');
const rawNodeString = require('./rawNodeString.cjs');

/**
 * Return a CSS statement's block -- the string that starts and `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`), returns an empty string.
 *
 * @param {import('postcss').Container} statement
 * @returns {string}
 */
function blockString(statement) {
	if (!hasBlock(statement)) {
		return '';
	}

	return rawNodeString(statement).slice(beforeBlockString(statement).length);
}

module.exports = blockString;
