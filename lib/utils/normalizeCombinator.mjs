/**
 * Normalize a combinator's whitespace to a single space.
 *
 * @param {string} value
 * @returns {string}
 */
export default function normalizeCombinator(value) {
	return value.replace(/\s+/g, ' ');
}
