import { jest } from '@jest/globals';

import createTtlCache, { MAX_CACHE_SIZE, TTL_MS } from '../createTtlCache.mjs';

describe('createTtlCache', () => {
	it('deletes entries', () => {
		const cache = createTtlCache();

		cache.set('foo', 1);
		cache.delete('foo');

		expect(cache.get('foo')).toBeUndefined();
	});

	it('clears all entries', () => {
		const cache = createTtlCache();

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.clear();

		expect(cache.get('foo')).toBeUndefined();
		expect(cache.get('bar')).toBeUndefined();
	});

	it('evicts the oldest entry when full', () => {
		const cache = createTtlCache();

		for (let index = 0; index < MAX_CACHE_SIZE; index++) {
			cache.set(`key-${index}`, index);
		}

		cache.set('one-too-many', -1);

		expect(cache.get('key-0')).toBeUndefined();
		expect(cache.get('key-1')).toBe(1);
		expect(cache.get('one-too-many')).toBe(-1);
	});
});

describe('createTtlCache TTL expiration', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('expires entries after the TTL', () => {
		const cache = createTtlCache();

		cache.set('foo', 1);

		// Advance time to just under the TTL.
		jest.advanceTimersByTime(TTL_MS - 60 * 1000);

		expect(cache.get('foo')).toBe(1);

		// Advance time past the TTL.
		jest.advanceTimersByTime(2 * 60 * 1000);

		expect(cache.get('foo')).toBeUndefined();
	});
});
