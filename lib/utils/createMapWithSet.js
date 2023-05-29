'use strict';

const flattenArray = require('./flattenArray');

/**
 * Create a map with unique sets of values from a record.
 *
 * @template T
 * @param {Record<string, T | T[]>} record
 * @returns {Map<string, Set<T>>}
 */
module.exports = function createMapWithSet(record) {
	/** @type {Map<string, Set<T>>} */
	const map = new Map();

	for (const key in record) {
		if (!Object.hasOwnProperty.call(record, key)) continue;

		const list = flattenArray(record[key]);

		if (!list) continue;

		map.set(key, new Set(list));
	}

	return map;
};
