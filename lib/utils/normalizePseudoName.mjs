/**
 * Normalize a pseudo-selector name for lookups:
 * lowercased, without leading colons
 *
 * @param {string} value
 * @returns {string}
 */
export default function normalizePseudoName(value) {
	return value.toLowerCase().replace(/^:+/, '');
}
