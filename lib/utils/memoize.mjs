import getOrInsertComputed from './getOrInsertComputed.mjs';

/**
 * A variant of `fn` that computes once per key, for as long as the key is alive
 *
 * @template {WeakKey} K
 * @template V
 * @param {(key: K) => V} fn
 * @returns {(key: K) => V}
 */
export default function memoize(fn) {
	/** @type {WeakMap<K, V>} */
	const cache = new WeakMap();

	return (key) => getOrInsertComputed(cache, key, () => fn(key));
}
