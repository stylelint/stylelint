// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

const validateTypes = require('./validateTypes.cjs');

/** @typedef {false | { match: string, pattern: string, substring: string }} ReturnValue */

/**
 * Checks if a string contains a value. The comparison value can be a string or
 * an array of strings.
 *
 * Any strings starting and ending with `/` are ignored. Use the
 * matchesStringOrRegExp() util to match regexes.
 *
 * @template {unknown} T
 * @param {string} input
 * @param {T | T[]} comparison
 * @returns {ReturnValue}
 */
function containsString(input, comparison) {
	if (!Array.isArray(comparison)) {
		return testAgainstString(input, comparison);
	}

	for (const comparisonItem of comparison) {
		const testResult = testAgainstString(input, comparisonItem);

		if (testResult) {
			return testResult;
		}
	}

	return false;
}

/**
 * @param {string} value
 * @param {unknown} comparison
 * @returns {ReturnValue}
 */
function testAgainstString(value, comparison) {
	if (!comparison) return false;

	if (!validateTypes.isString(comparison)) return false;

	if (comparison.startsWith('/') && comparison.endsWith('/')) {
		return false;
	}

	if (value.includes(comparison)) {
		return { match: value, pattern: comparison, substring: comparison };
	}

	return false;
}

module.exports = containsString;
