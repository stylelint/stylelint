import path from 'node:path';

import { jest } from '@jest/globals';

import cachedImport, { TTL_MS, clearModuleCache } from '../cachedImport.mjs';

const dirname = import.meta.dirname;
const fixtureModuleA = path.join(dirname, 'fixtures/module-a.mjs');
const fixtureModuleB = path.join(dirname, 'fixtures/module-b.mjs');

beforeEach(() => {
	clearModuleCache();
});

describe('cachedImport', () => {
	it('returns the imported module', async () => {
		const result = await cachedImport(fixtureModuleA);

		expect(result.default).toEqual({ name: 'fixture-module-a' });
	});

	it('returns cached promise on subsequent calls', async () => {
		const first = cachedImport(fixtureModuleA);
		const second = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		expect(first).toBe(second);

		const [result1, result2] = await Promise.all([first, second]);

		expect(result1).toBe(result2);
	});

	it('caches different modules separately', async () => {
		const resultA = await cachedImport(fixtureModuleA);
		const resultB = await cachedImport(fixtureModuleB);

		expect(resultA.default).toEqual({ name: 'fixture-module-a' });
		expect(resultB.default).toEqual({ name: 'fixture-module-b' });
	});

	it('returns same promise for concurrent calls', async () => {
		const promise1 = cachedImport(fixtureModuleA);
		const promise2 = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		expect(promise1).toBe(promise2);

		const [result1, result2] = await Promise.all([promise1, promise2]);

		expect(result1).toBe(result2);
	});
});

describe('cachedImport TTL expiration', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('returns cached value before TTL expires', async () => {
		const first = await cachedImport(fixtureModuleA);

		// Advance time to just under the TTL.
		jest.advanceTimersByTime(TTL_MS - 60 * 1000);

		const second = await cachedImport(fixtureModuleA);

		// Should return the same cached value.
		expect(second).toBe(first);
	});
});
