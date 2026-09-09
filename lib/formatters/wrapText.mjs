import getStringWidth, { getGraphemeWidth, segmentGraphemes } from '../utils/getStringWidth.mjs';

/** Characters after which a word wider than the available width may break. */
const BREAK_CHARACTERS = new Set(['\\', '/', '_', '.', ',', ';', '-']);

/**
 * Split a word wider than `width` into the widest head that fits and the rest,
 * preferring to break after the last of the `BREAK_CHARACTERS` in that head.
 * @param {string} word
 * @param {number} width
 * @returns {[string, string]}
 */
function breakWord(word, width) {
	let head = '';
	let headWidth = 0;
	let breakLength = 0;

	for (const grapheme of segmentGraphemes(word)) {
		const graphemeWidth = getGraphemeWidth(grapheme);

		if (head !== '' && headWidth + graphemeWidth > width) break;

		head += grapheme;
		headWidth += graphemeWidth;

		// Avoid a line of only the break character
		if (BREAK_CHARACTERS.has(grapheme) && head !== grapheme) breakLength = head.length;
	}

	if (breakLength > 0) head = head.slice(0, breakLength);

	return [head, word.slice(head.length)];
}

/**
 * Wrap `text` into lines no wider than `width` terminal columns.
 * Lines break at spaces, and a word wider than `width` breaks within itself.
 * @param {string} text
 * @param {number} width
 * @returns {string[]}
 */
export default function wrapText(text, width) {
	if (getStringWidth(text) <= width) return [text];

	/** @type {string[]} */
	const lines = [];
	let line = '';

	for (const word of text.split(' ')) {
		const candidate = line === '' ? word : `${line} ${word}`;

		if (getStringWidth(candidate) <= width) {
			line = candidate;
			continue;
		}

		if (line !== '') lines.push(line.trimEnd());

		line = word;

		while (getStringWidth(line) > width) {
			const [head, rest] = breakWord(line, width);

			lines.push(head);
			line = rest;
		}
	}

	if (line !== '') lines.push(line.trimEnd());

	return lines;
}
