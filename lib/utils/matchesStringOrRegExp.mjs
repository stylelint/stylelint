import testAgainstStringOrRegExp from './testAgainstStringOrRegExp.mjs';

/**
 * Compares a string to a second value that, if it fits a certain convention,
 * is converted to a regular expression before the comparison.
 * If it doesn't fit the convention, then two strings are compared.
 *
 * Any strings starting and ending with `/` are interpreted
 * as regular expressions.
 *
 * @param {string | Array<string>} input
 * @param {string | RegExp | Array<string | RegExp>} comparison
 *
 * @returns {false | {match: string, pattern: (string | RegExp), substring: string}}
 */
export default function matchesStringOrRegExp(input, comparison) {
	if (!Array.isArray(input)) {
		return testAgainstStringOrRegExpOrArray(input, comparison);
	}

	for (const inputItem of input) {
		const testResult = testAgainstStringOrRegExpOrArray(inputItem, comparison);

		if (testResult) {
			return testResult;
		}
	}

	return false;
}

/**
 * @param {string} value
 * @param {string | RegExp | Array<string | RegExp>} comparison
 */
function testAgainstStringOrRegExpOrArray(value, comparison) {
	if (!Array.isArray(comparison)) {
		return testAgainstStringOrRegExp(value, comparison);
	}

	for (const comparisonItem of comparison) {
		const testResult = testAgainstStringOrRegExp(value, comparisonItem);

		if (testResult) {
			return testResult;
		}
	}

	return false;
}
