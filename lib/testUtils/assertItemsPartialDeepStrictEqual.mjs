import assert from 'node:assert/strict';

/**
 * `partialDeepStrictEqual` alone accepts extra items, so the length is asserted first.
 *
 * @param {unknown[]} actual
 * @param {unknown[]} expected
 * @returns {void}
 */
export default function assertItemsPartialDeepStrictEqual(actual, expected) {
	assert.equal(actual.length, expected.length);
	assert.partialDeepStrictEqual(actual, expected);
}
