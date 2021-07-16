'use strict';

/**
 * Tests if two arrays are equal.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
module.exports = function arrayEqual(a, b) {
	if (!Array.isArray(a) || !Array.isArray(b)) return false;

	if (a.length !== b.length) return false;

	return a.every((elem, index) => elem === b[index]);
};
