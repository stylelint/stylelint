import { stripVTControlCharacters } from 'node:util';

import { assertNumber } from './validateTypes.mjs';

/** A character outside printable ASCII, whose width the fast path cannot count by length. */
const NON_PRINTABLE_ASCII_PATTERN = /[\P{ASCII}\p{Control}]/u;

const SINGLE_CODE_POINT_PATTERN = /^.$/su;

/**
 * A code point that a terminal renders without taking a column.
 * Tabs count as control characters and so are ignored by design.
 */
const NON_PRINTABLE_CHARACTER_PATTERN =
	/^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Nonspacing_Mark}\p{Enclosing_Mark}\p{Surrogate}]$/u;

/**
 * A grapheme cluster that a terminal renders as an emoji: a default emoji presentation,
 * a text-presentation pictograph followed by an emoji variation selector, or a keycap sequence.
 */
const EMOJI_PATTERN = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|\u20E3/u;

/**
 * Inclusive ranges of the East Asian Wide and Fullwidth code points, originally copied from
 * https://github.com/sindresorhus/is-fullwidth-code-point/blob/80e5e314d86e5f76bd1b0573aa9d33e615a372db/index.js
 * @version 3.0.0
 * @type {Array<[number, number]>}
 */
const WIDE_RANGES = [
	[0x1100, 0x115f], // Hangul Jamo
	[0x2329, 0x232a], // Left- and right-pointing angle brackets
	[0x2e80, 0x303e], // CJK Radicals Supplement .. CJK Symbols and Punctuation
	[0x3040, 0x3247], // Hiragana .. Enclosed CJK Letters and Months
	[0x3250, 0x4dbf], // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
	[0x4e00, 0xa4c6], // CJK Unified Ideographs .. Yi Radicals
	[0xa960, 0xa97c], // Hangul Jamo Extended-A
	[0xac00, 0xd7a3], // Hangul Syllables
	[0xf900, 0xfaff], // CJK Compatibility Ideographs
	[0xfe10, 0xfe19], // Vertical Forms
	[0xfe30, 0xfe6b], // CJK Compatibility Forms .. Small Form Variants
	[0xff01, 0xff60], // Fullwidth Forms
	[0xffe0, 0xffe6], // Fullwidth Signs
	[0x1b000, 0x1b001], // Kana Supplement
	[0x1f200, 0x1f251], // Enclosed Ideographic Supplement
	[0x20000, 0x3fffd], // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
];

/** @type {Intl.Segmenter | undefined} */
let segmenter;

/**
 * @param {string} text
 * @returns {boolean}
 */
function isPrintableAscii(text) {
	return !NON_PRINTABLE_ASCII_PATTERN.test(text);
}

/**
 * @param {string} character
 * @returns {boolean}
 */
function isPrintableCharacter(character) {
	return !NON_PRINTABLE_CHARACTER_PATTERN.test(character);
}

/**
 * @param {string} character
 * @returns {boolean}
 */
function isWideCharacter(character) {
	const codePoint = character.codePointAt(0);

	assertNumber(codePoint);

	return WIDE_RANGES.some(([start, end]) => start <= codePoint && codePoint <= end);
}

/**
 * Split `text` into grapheme clusters.
 * The segmenter is built on first use, as the first one in a process initialises ICU at a cost of several milliseconds.
 * @param {string} text
 * @returns {string[]}
 */
export function segmentGraphemes(text) {
	segmenter ??= new Intl.Segmenter();

	return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

/**
 * Get the number of terminal columns a grapheme cluster takes up.
 * @param {string} grapheme
 * @returns {number}
 */
export function getGraphemeWidth(grapheme) {
	const baseCharacter = [...grapheme].find(isPrintableCharacter);

	if (baseCharacter === undefined) return 0;

	if (EMOJI_PATTERN.test(grapheme)) return 2;

	return isWideCharacter(baseCharacter) ? 2 : 1;
}

/**
 * Originally modelled on https://github.com/sindresorhus/string-width/blob/64dc20cddd374df0ff43ba3469491ae98cf0cdfc/index.js
 * @version 8.2.2
 * @summary Get the number of terminal columns a string takes up, ignoring ANSI escape codes
 * @param {string} text
 * @returns {number}
 */
export default function getStringWidth(text) {
	if (isPrintableAscii(text)) return text.length;

	const visibleText = stripVTControlCharacters(text);

	if (isPrintableAscii(visibleText)) return visibleText.length;

	// A single code point is always one grapheme cluster, so it needs no segmenter
	if (SINGLE_CODE_POINT_PATTERN.test(visibleText)) return getGraphemeWidth(visibleText);

	let width = 0;

	for (const grapheme of segmentGraphemes(visibleText)) {
		width += getGraphemeWidth(grapheme);
	}

	return width;
}
