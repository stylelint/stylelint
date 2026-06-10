/** Maximum number of entries to cache to prevent unbounded memory growth. */
export const MAX_CACHE_SIZE = 1000;

/** Time-to-live in milliseconds. */
export const TTL_MS = 30 * 60 * 1000;

/**
 * @template V
 * @typedef {Object} TtlCache
 * @property {(key: string) => V | undefined} get
 * @property {(key: string, value: V) => void} set
 * @property {(key: string) => void} delete
 * @property {() => void} clear
 */

/**
 * Creates a bounded key-value cache whose entries expire after a time-to-live.
 *
 * @template V
 * @returns {TtlCache<V>}
 */
export default function createTtlCache() {
	/** @type {Map<string, { value: V, timestamp: number }>} */
	const entries = new Map();

	return {
		get(key) {
			const entry = entries.get(key);

			if (!entry) return undefined;

			// Check if entry has expired.
			if (Date.now() - entry.timestamp > TTL_MS) {
				entries.delete(key);

				return undefined;
			}

			return entry.value;
		},
		set(key, value) {
			// Evict oldest entry if cache is full.
			if (entries.size >= MAX_CACHE_SIZE) {
				const oldestKey = entries.keys().next().value;

				if (oldestKey !== undefined) {
					entries.delete(oldestKey);
				}
			}

			entries.set(key, { value, timestamp: Date.now() });
		},
		delete(key) {
			entries.delete(key);
		},
		clear() {
			entries.clear();
		},
	};
}
