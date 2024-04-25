/**
 * @param {string} value
 * @param {string | RegExp} comparison
 */
export default function testAgainstStringOrRegExp(value, comparison) {
	// If it's a RegExp, test directly
	if (comparison instanceof RegExp) {
		const match = value.match(comparison);

		return match ? { match: value, pattern: comparison, substring: match[0] || '' } : false;
	}

	// Check if it's RegExp in a string
	const firstComparisonChar = comparison[0];
	const lastComparisonChar = comparison[comparison.length - 1];
	const secondToLastComparisonChar = comparison[comparison.length - 2];

	const comparisonIsRegex =
		firstComparisonChar === '/' &&
		(lastComparisonChar === '/' ||
			(secondToLastComparisonChar === '/' && lastComparisonChar === 'i'));

	const hasCaseInsensitiveFlag = comparisonIsRegex && lastComparisonChar === 'i';

	// If so, create a new RegExp from it
	if (comparisonIsRegex) {
		const valueMatch = hasCaseInsensitiveFlag
			? value.match(new RegExp(comparison.slice(1, -2), 'i'))
			: value.match(new RegExp(comparison.slice(1, -1)));

		return valueMatch
			? { match: value, pattern: comparison, substring: valueMatch[0] || '' }
			: false;
	}

	// Otherwise, it's a string. Do a strict comparison
	return value === comparison ? { match: value, pattern: comparison, substring: value } : false;
}
