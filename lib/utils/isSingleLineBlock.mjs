import blockString from './blockString.mjs';
import isSingleLineString from './isSingleLineString.mjs';

/**
 * @param {import('postcss').Container} statement
 * @returns {boolean}
 */
export default function isSingleLineBlock(statement) {
	// Saves stringifying a block that has a newline before its closing brace
	if (!isSingleLineString(statement.raws.after ?? '')) return false;

	return isSingleLineString(blockString(statement));
}
