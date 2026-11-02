/**
 * Inclusive at both ends, so a range is within itself
 *
 * @param {{ start: number, end: number }} range
 * @param {number} start
 * @param {number} end
 * @returns {boolean}
 */
export default function isWithinRange(range, start, end) {
	return start <= range.start && range.end <= end;
}
