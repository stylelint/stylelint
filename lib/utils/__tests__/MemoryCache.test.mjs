import { describe, it } from 'node:test';

import MemoryCache from '../MemoryCache.mjs';

describe('MemoryCache', () => {
	it('deletes entries', (t) => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.delete('foo');

		t.assert.strictEqual(cache.get('foo'), undefined);
	});

	it('clears all entries', (t) => {
		const cache = new MemoryCache();

		cache.set('foo', 1);
		cache.set('bar', 2);
		cache.clear();

		t.assert.strictEqual(cache.get('foo'), undefined);
		t.assert.strictEqual(cache.get('bar'), undefined);
	});

	it('evicts the oldest entry when full', (t) => {
		const cache = new MemoryCache({ maxSize: 2 });

		cache.set('a', 1);
		cache.set('b', 2);
		cache.set('c', 3);

		t.assert.strictEqual(cache.get('a'), undefined);
		t.assert.strictEqual(cache.get('b'), 2);
		t.assert.strictEqual(cache.get('c'), 3);
	});
});

describe('MemoryCache TTL expiration', () => {
	it('expires entries after the TTL', (t) => {
		let now = Date.now();

		t.mock.method(Date, 'now', () => now);

		const cache = new MemoryCache({ ttlMs: 1000 });

		cache.set('foo', 1);

		now += 999;
		t.assert.strictEqual(cache.get('foo'), 1);

		now += 2;
		t.assert.strictEqual(cache.get('foo'), undefined);
	});
});
