import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import MemoryCache from '../MemoryCache.mjs';

describe('MemoryCache', () => {
	it('deletes entries', () => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.delete('foo');

		assert.equal(cache.get('foo'), undefined);
	});

	it('clears all entries', () => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.clear();

		assert.equal(cache.get('foo'), undefined);
		assert.equal(cache.get('bar'), undefined);
	});

	it('evicts the oldest entry when full', () => {
		const cache = new MemoryCache({ maxSize: 2 });

		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('c', 3);

		assert.equal(cache.get('a'), undefined);
		assert.equal(cache.get('b'), 2);
		assert.equal(cache.get('c'), 3);
	});
});

describe('MemoryCache TTL expiration', () => {
	it('expires entries after the TTL', (t) => {
		let now = Date.now();

		t.mock.method(Date, 'now', () => now);

		const cache = new MemoryCache({ ttlMs: 1000 });

		cache.set('foo', 1);

		now += 999;
		assert.equal(cache.get('foo'), 1);

		now += 2;
		assert.equal(cache.get('foo'), undefined);
	});
});
