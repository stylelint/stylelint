'use strict';

const HAS_DIMENSION_LIKE_VALUES = /\d[%\w-]/;

/**
 * Check if a value contains any dimension-like values.
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function hasDimension(value) {
	return HAS_DIMENSION_LIKE_VALUES.test(value);
};
