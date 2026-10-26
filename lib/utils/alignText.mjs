import getStringWidth from './getStringWidth.mjs';

/**
 * @param {string} text
 * @param {number} width
 * @returns {number}
 */
function getPaddingWidth(text, width) {
	return Math.max(0, width - getStringWidth(text));
}

/**
 * Pad `text` on the right to `width` terminal columns.
 * @param {string} text
 * @param {number} width
 * @param {string} [fill]
 * @returns {string}
 */
export function alignLeft(text, width, fill = ' ') {
	return text + fill.repeat(getPaddingWidth(text, width));
}

/**
 * Pad `text` on the left to `width` terminal columns.
 * @param {string} text
 * @param {number} width
 * @param {string} [fill]
 * @returns {string}
 */
export function alignRight(text, width, fill = ' ') {
	return fill.repeat(getPaddingWidth(text, width)) + text;
}

/**
 * Pad `text` on both sides to `width` terminal columns, giving the right side any odd column.
 * @param {string} text
 * @param {number} width
 * @returns {string}
 */
export function alignCenter(text, width) {
	const paddingWidth = getPaddingWidth(text, width);

	return ' '.repeat(Math.floor(paddingWidth / 2)) + text + ' '.repeat(Math.ceil(paddingWidth / 2));
}
