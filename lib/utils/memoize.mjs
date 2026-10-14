import getOrInsertComputed from './getOrInsertComputed.mjs';

/**
 * A variant of `compute` that runs once per key, for as long as the key is alive
 *
 * @template {WeakKey} K
 * @template V
 * @param {(key: K) => V} compute
 * @returns {(key: K) => V}
 */
export default function memoize(compute) {
	/** @type {WeakMap<K, V>} */
	const cache = new WeakMap();

	return (key) => getOrInsertComputed(cache, key, () => compute(key));
}
