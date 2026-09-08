/**
 * Compute the Levenshtein distance between two strings: the minimum number of
 * single-character insertions, deletions, and substitutions that turn one into
 * the other. Characters are compared as UTF-16 code units.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export default function levenshteinDistance(a, b) {
	// Each entry holds the distance from the current prefix of `a` to a non-empty
	// prefix of `b`. The row is updated in place, one character of `a` at a time.
	const row = Array.from({ length: b.length }, (_, index) => index + 1);

	let distance = b.length;

	for (let i = 1; i <= a.length; i++) {
		const code = a.charCodeAt(i - 1);
		let diagonal = i - 1;
		let left = i;

		for (const [index, above] of row.entries()) {
			const substitutionCost = code === b.charCodeAt(index) ? 0 : 1;
			const current = Math.min(above + 1, left + 1, diagonal + substitutionCost);

			row[index] = current;
			diagonal = above;
			left = current;
		}

		distance = left;
	}

	return distance;
}
