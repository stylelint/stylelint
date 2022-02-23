'use strict';

/**
 * Convert the specified value to an array. If an array is specified, the array is returned as-is.
 *
 * @template T
 * @param {T | T[] | undefined | null} value
 * @returns {T[] | undefined}
 */
module.exports = function flattenArray(value) {
	if (value == null) {
		return;
	}

	return Array.isArray(value) ? value : [value];
};
