import getStringWidth from './getStringWidth.mjs';

/**
 * Get the terminal columns of the widest `key` cell in `rows`.
 * Cells repeat across rows (severity symbols, rule names, message texts), so each distinct cell is measured once.
 * A column is never narrower than one, so an empty cell still separates its neighbours.
 * @template {string} K
 * @param {Record<K, string>[]} rows
 * @param {K} key
 * @returns {number}
 */
export default function getColumnWidth(rows, key) {
	let width = 1;

	for (const cell of new Set(rows.map((row) => row[key]))) {
		width = Math.max(width, getStringWidth(cell));
	}

	return width;
}
