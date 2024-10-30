import { isNumber } from './validateTypes.mjs';

/** @import {Node, Position as PostCssPosition} from 'postcss' */
/** @import {Range} from 'stylelint' */

/**
 * Get the range for start and end index inside the node as it appeared in the original source.
 * The start index is inclusive; the end index is exclusive.
 *
 * This is a modified version of `Node.prototype.rangeBy` from PostCSS:
 * https://github.com/postcss/postcss/blob/1cc6ac3bf43a12460d3396e2cb76f14075daea1b/lib/node.js#L212-L267
 *
 * It only supports what we use and it looks at the original source.
 * Whereas PostCSS looks at the current string representation of the given node.
 * We require the original position to accurately disable and enable rules.
 *
 * @param {Node} node
 * @param {{ index?: number, endIndex?: number }} opts
 * @returns {{start: Range['start'], end: Range['end']} | undefined}
 */
export default function nodeRangeBy(node, opts) {
	if (!node) return;

	let inputCSS = node.source?.input?.css;
	let sourceStart = node.source?.start;
	let sourceEnd = node.source?.end;

	// Fallback to letting PostCSS determine the Range if we don't have sufficient information about the original source.
	if (!inputCSS || !sourceStart || !sourceEnd) {
		return node.rangeBy(opts);
	}

	let start = {
		column: sourceStart.column,
		line: sourceStart.line,
	};

	if (isNumber(opts.index)) {
		start = positionInside(opts.index, inputCSS, sourceStart);
	}

	let end = {
		column: sourceEnd.column + 1,
		line: sourceEnd.line,
	};

	if (isNumber(opts.endIndex)) {
		end = positionInside(opts.endIndex, inputCSS, sourceStart);
	} else if (isNumber(opts.index)) {
		end = positionInside(opts.index + 1, inputCSS, sourceStart);
	}

	if (end.line < start.line || (end.line === start.line && end.column <= start.column)) {
		end = { column: start.column + 1, line: start.line };
	}

	return { end, start };
}

/**
 * Calculate the line and column position inside the original source
 *
 * @param {number} offset
 * @param {string} inputCSS
 * @param {PostCssPosition} sourceStart
 *
 * @returns {Range['start']}
 */
function positionInside(offset, inputCSS, sourceStart) {
	let column = sourceStart.column;
	let line = sourceStart.line;
	let startOffset = sourceStart.offset;

	for (let i = startOffset; i < startOffset + offset; i++) {
		if (inputCSS[i] === '\n') {
			column = 1;
			line += 1;
		} else {
			column += 1;
		}
	}

	return { column, line };
}
