import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import cachedImport, { clearModuleCache } from '../cachedImport.mjs';

const dirname = import.meta.dirname;
const fixtureModuleA = path.join(dirname, 'fixtures/module-a.mjs');
const fixtureModuleB = path.join(dirname, 'fixtures/module-b.mjs');

beforeEach(() => {
	clearModuleCache();
});

describe('cachedImport', () => {
	it('returns the imported module', async () => {
		const result = await cachedImport(fixtureModuleA);

		assert.deepEqual(result.default, { name: 'fixture-module-a' });
	});

	it('returns cached promise on subsequent calls', async () => {
		const first = cachedImport(fixtureModuleA);
		const second = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		assert.equal(first, second);

		const [result1, result2] = await Promise.all([first, second]);

		assert.equal(result1, result2);
	});

	it('caches different modules separately', async () => {
		const resultA = await cachedImport(fixtureModuleA);
		const resultB = await cachedImport(fixtureModuleB);

		assert.deepEqual(resultA.default, { name: 'fixture-module-a' });
		assert.deepEqual(resultB.default, { name: 'fixture-module-b' });
	});

	it('returns same promise for concurrent calls', async () => {
		const promise1 = cachedImport(fixtureModuleA);
		const promise2 = cachedImport(fixtureModuleA);

		// Should be the exact same promise object.
		assert.equal(promise1, promise2);

		const [result1, result2] = await Promise.all([promise1, promise2]);

		assert.equal(result1, result2);
	});
});
