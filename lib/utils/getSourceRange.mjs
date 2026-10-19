/** @import { CSSToken } from '@csstools/css-tokenizer' */

/** @typedef {[startOffset: number, endOffset: number]} OffsetRange */

/**
 * Map a range of the stringified tokens back to the source
 *
 * @param {CSSToken[]} tokens
 * @param {OffsetRange} range
 * @returns {OffsetRange | undefined} `undefined` when the range doesn't start and end at tokens
 */
export default function getSourceRange(tokens, [startOffset, endOffset]) {
	let counter = 0;
	let startToken;
	let endToken;

	for (const token of tokens) {
		if (startOffset === counter) {
			startToken = token;
		}

		counter += token[1].length;

		if (endOffset === counter) {
			endToken = token;
			break;
		}
	}

	if (!startToken || !endToken) return undefined;

	return [startToken[2], endToken[3] + 1];
}
