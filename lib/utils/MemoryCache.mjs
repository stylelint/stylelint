/**
 * A bounded, in-memory key-value cache whose entries expire after a time-to-live.
 *
 * @template V
 */
export default class MemoryCache {
	/** @type {Map<string, { value: V, timestamp: number }>} */
	#entries = new Map();
	#maxSize;
	#ttlMs;

	/**
	 * @param {object} [options]
	 * @param {number} [options.maxSize] Maximum number of entries before the oldest is evicted.
	 * @param {number} [options.ttlMs] Time-to-live in milliseconds.
	 */
	constructor({ maxSize = 1000, ttlMs = 30 * 60 * 1000 } = {}) {
		this.#maxSize = maxSize;
		this.#ttlMs = ttlMs;
	}

	/**
	 * @param {string} key
	 * @returns {V | undefined}
	 */
	get(key) {
		const entry = this.#entries.get(key);

		if (!entry) return undefined;

		// Check if entry has expired.
		if (Date.now() - entry.timestamp > this.#ttlMs) {
			this.#entries.delete(key);

			return undefined;
		}

		return entry.value;
	}

	/**
	 * @param {string} key
	 * @param {V} value
	 */
	set(key, value) {
		// Evict oldest entry if cache is full.
		if (this.#entries.size >= this.#maxSize) {
			const oldestKey = this.#entries.keys().next().value;

			if (oldestKey !== undefined) {
				this.#entries.delete(oldestKey);
			}
		}

		this.#entries.set(key, { value, timestamp: Date.now() });
	}

	/**
	 * @param {string} key
	 */
	delete(key) {
		this.#entries.delete(key);
	}

	clear() {
		this.#entries.clear();
	}
}
