/**
 * If `map` already has the given `key`, returns its value. Otherwise, calls
 * `callback`, adds the result to `map` at `key`, and then returns it.
 *
 * @todo Replace this custom implementation with the native one once we require Node.js v26.0.0 or later.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/getOrInsertComputed
 * @see https://github.com/tc39/proposal-upsert
 *
 * @template K
 * @template V
 * @param {Map<K, V>} map
 * @param {K} key
 * @param {() => V} callback
 * @returns {V}
 */
export default function getOrInsertComputed(map, key, callback) {
	if (map.has(key)) return /** @type {V} */ (map.get(key));

	const value = callback();

	map.set(key, value);

	return value;
}
