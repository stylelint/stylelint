import { isNumber } from './validateTypes.mjs';

/**
 * Returns the position of a csstree parse error within the source it was thrown for:
 * the character at the error's offset, or the first character when the offset is unknown.
 *
 * @param {SyntaxError} error
 * @param {string} source
 * @returns {{ index: number, endIndex: number }}
 */
export default function getSyntaxErrorPosition(error, source) {
	const offset = 'offset' in error && isNumber(error.offset) ? error.offset : 0;

	return { index: offset, endIndex: Math.min(offset + 1, source.length) };
}
