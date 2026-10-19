import { jest } from '@jest/globals';

import MemoryCache from '../MemoryCache.mjs';

describe('MemoryCache', () => {
	it('deletes entries', () => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.delete('foo');

		expect(cache.get('foo')).toBeUndefined();
	});

	it('clears all entries', () => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.clear();

		expect(cache.get('foo')).toBeUndefined();
		expect(cache.get('bar')).toBeUndefined();
	});

	it('evicts the oldest entry when full', () => {
		const cache = new MemoryCache({ maxSize: 2 });

		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('c', 3);

		expect(cache.get('a')).toBeUndefined();
		expect(cache.get('b')).toBe(2);
		expect(cache.get('c')).toBe(3);
	});
});

describe('MemoryCache TTL expiration', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('expires entries after the TTL', () => {
		const cache = new MemoryCache({ ttlMs: 1000 });

		cache.set('foo', 1);

		jest.advanceTimersByTime(999);
		expect(cache.get('foo')).toBe(1);

		jest.advanceTimersByTime(2);
		expect(cache.get('foo')).toBeUndefined();
	});
});
